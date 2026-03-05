/**
 * YouTube Availability Detection Service
 *
 * Detects whether YouTube is reachable from the current network.
 * In regions where YouTube is blocked (e.g. China mainland behind GFW),
 * this allows the UI to gracefully degrade instead of showing broken iframes.
 *
 * Results are cached for the session lifetime to avoid repeated probes.
 */

type YouTubeStatus = 'unknown' | 'available' | 'blocked';

let cachedStatus: YouTubeStatus = 'unknown';
let probePromise: Promise<boolean> | null = null;

const PROBE_TIMEOUT_MS = 5000;
const PROBE_URL = 'https://www.youtube.com/favicon.ico';

/**
 * Probe YouTube reachability by fetching a lightweight static asset.
 * Returns `true` if YouTube is reachable, `false` otherwise.
 * The result is cached — subsequent calls return instantly.
 */
export async function isYouTubeAvailable(): Promise<boolean> {
  if (cachedStatus === 'available') return true;
  if (cachedStatus === 'blocked') return false;

  if (probePromise) return probePromise;

  probePromise = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

      // Use no-cors to avoid CORS errors — we only care about network reachability.
      // An opaque response (status 0) still means the host is reachable.
      await fetch(PROBE_URL, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeout);
      cachedStatus = 'available';
      return true;
    } catch {
      cachedStatus = 'blocked';
      return false;
    } finally {
      probePromise = null;
    }
  })();

  return probePromise;
}

/** Returns the current cached status without triggering a new probe. */
export function getYouTubeStatus(): YouTubeStatus {
  return cachedStatus;
}

/** Reset cached status (e.g. for network change events). */
export function resetYouTubeStatus(): void {
  cachedStatus = 'unknown';
  probePromise = null;
}

// Re-probe when the user's network changes (e.g. VPN toggled on/off).
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('online', () => resetYouTubeStatus());
}
