/**
 * Rate Limiting utility for Vercel Edge Functions.
 *
 * Uses Upstash Redis sliding window counters.
 * Falls back to permissive (no limiting) if Redis is unconfigured.
 *
 * Usage in an API handler:
 *   import { checkRateLimit } from './_rate-limit.js';
 *   const rl = await checkRateLimit(request, { windowSec: 60, maxRequests: 30 });
 *   if (rl.limited) return rl.response;
 */

const DEFAULT_WINDOW_SEC = 60;
const DEFAULT_MAX_REQUESTS = 60;

/**
 * @param {Request} request
 * @param {{ windowSec?: number, maxRequests?: number, prefix?: string }} [opts]
 * @returns {Promise<{ limited: boolean, response?: Response, remaining: number }>}
 */
export async function checkRateLimit(request, opts = {}) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Permissive fallback — no Redis configured
  if (!url || !token) {
    return { limited: false, remaining: Infinity };
  }

  const windowSec = opts.windowSec ?? DEFAULT_WINDOW_SEC;
  const maxRequests = opts.maxRequests ?? DEFAULT_MAX_REQUESTS;
  const prefix = opts.prefix ?? 'rl';

  // Identify client by IP (Vercel provides this header)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const now = Math.floor(Date.now() / 1000);
  const windowKey = Math.floor(now / windowSec);
  const key = `${prefix}:${ip}:${windowKey}`;

  try {
    // INCR + EXPIRE in a single pipeline
    const pipelineBody = [
      ['INCR', key],
      ['EXPIRE', key, windowSec],
    ];

    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipelineBody),
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      // Redis error — fail open (permissive)
      return { limited: false, remaining: maxRequests };
    }

    const results = await res.json();
    const count = results?.[0]?.result ?? 0;
    const remaining = Math.max(0, maxRequests - count);

    if (count > maxRequests) {
      return {
        limited: true,
        remaining: 0,
        response: new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(windowSec),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String((windowKey + 1) * windowSec),
          },
        }),
      };
    }

    return { limited: false, remaining };
  } catch {
    // Network/timeout error — fail open
    return { limited: false, remaining: maxRequests };
  }
}
