/**
 * Health Check Endpoint — /api/health
 *
 * Aggregated health probe for monitoring and alerting.
 * Checks: Upstash Redis connectivity, external data source reachability.
 * Returns 200 if core services are healthy, 503 if degraded.
 */

import { getCorsHeaders } from './_cors.js';

export const config = { runtime: 'edge' };

async function checkUpstashRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { status: 'unconfigured' };

  try {
    const res = await fetch(`${url}/ping`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      return { status: data.result === 'PONG' ? 'ok' : 'degraded' };
    }
    return { status: 'degraded', code: res.status };
  } catch (e) {
    return { status: 'down', error: e.message };
  }
}

async function checkExternalSource(name, url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'WorldMonitor-HealthCheck/1.0' },
    });
    return { name, status: res.ok ? 'ok' : 'degraded', code: res.status };
  } catch (e) {
    return { name, status: 'down', error: e.message };
  }
}

export default async function handler(request) {
  const cors = getCorsHeaders(request);
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  const t0 = Date.now();

  const [redis, ...sources] = await Promise.all([
    checkUpstashRedis(),
    checkExternalSource('github-releases', 'https://api.github.com'),
    checkExternalSource('rss-bbc', 'https://feeds.bbci.co.uk/news/rss.xml'),
    checkExternalSource('youtube', 'https://www.youtube.com/favicon.ico'),
  ]);

  const checks = { redis, sources };
  const allOk = redis.status !== 'down' && sources.every(s => s.status !== 'down');
  const elapsed = Date.now() - t0;

  const body = {
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    elapsed_ms: elapsed,
    checks,
  };

  return new Response(JSON.stringify(body), {
    status: allOk ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store',
      ...cors,
    },
  });
}
