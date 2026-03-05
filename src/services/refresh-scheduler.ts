/**
 * RefreshScheduler — Manages periodic data refresh with:
 * - Jittered intervals to avoid thundering herd
 * - Visibility-based throttling (4x slower when tab is hidden)
 * - Conditional execution (skip if layer disabled)
 * - In-flight deduplication (skip if previous run still pending)
 * - Stale flush on tab re-focus
 *
 * Extracted from App.ts to reduce god-object complexity.
 */

interface RefreshRunner {
  run: () => Promise<void>;
  intervalMs: number;
}

export interface RefreshTask {
  name: string;
  fn: () => Promise<void>;
  intervalMs: number;
  /** Optional condition — refresh is skipped when this returns false. */
  condition?: () => boolean;
}

const HIDDEN_REFRESH_MULTIPLIER = 4;
const JITTER_FRACTION = 0.1;
const MIN_REFRESH_MS = 1000;

function computeDelay(baseMs: number, isHidden: boolean): number {
  const adjusted = baseMs * (isHidden ? HIDDEN_REFRESH_MULTIPLIER : 1);
  const jitterRange = adjusted * JITTER_FRACTION;
  const jittered = adjusted + (Math.random() * 2 - 1) * jitterRange;
  return Math.max(MIN_REFRESH_MS, Math.round(jittered));
}

export class RefreshScheduler {
  private runners = new Map<string, RefreshRunner>();
  private timeoutIds = new Map<string, ReturnType<typeof setTimeout>>();
  private inFlight = new Set<string>();
  private destroyed = false;
  public hiddenSince = 0;

  /** Register and immediately start a periodic refresh task. */
  schedule(task: RefreshTask): void {
    const { name, fn, intervalMs, condition } = task;

    const scheduleNext = (delay: number) => {
      if (this.destroyed) return;
      const timeoutId = setTimeout(run, delay);
      this.timeoutIds.set(name, timeoutId);
    };

    const run = async () => {
      if (this.destroyed) return;
      const isHidden = document.visibilityState === 'hidden';
      if (isHidden) {
        scheduleNext(computeDelay(intervalMs, true));
        return;
      }
      if (condition && !condition()) {
        scheduleNext(computeDelay(intervalMs, false));
        return;
      }
      if (this.inFlight.has(name)) {
        scheduleNext(computeDelay(intervalMs, false));
        return;
      }
      this.inFlight.add(name);
      try {
        await fn();
      } catch (e) {
        console.error(`[Refresh] ${name} failed:`, e);
      } finally {
        this.inFlight.delete(name);
        scheduleNext(computeDelay(intervalMs, false));
      }
    };

    this.runners.set(name, { run, intervalMs });
    scheduleNext(computeDelay(intervalMs, document.visibilityState === 'hidden'));
  }

  /** Check whether a task name is currently executing. */
  isRunning(name: string): boolean {
    return this.inFlight.has(name);
  }

  /** Mark a task as in-flight (for use by external guarded runners). */
  markInFlight(name: string): void {
    this.inFlight.add(name);
  }

  /** Clear in-flight flag for a task. */
  clearInFlight(name: string): void {
    this.inFlight.delete(name);
  }

  /**
   * Run a function with in-flight deduplication.
   * If `name` is already running, the call is silently skipped.
   * Shared with periodic schedules — prevents initial load + first refresh overlap.
   */
  async runGuarded(name: string, fn: () => Promise<void>): Promise<void> {
    if (this.inFlight.has(name)) return;
    this.inFlight.add(name);
    try {
      await fn();
    } catch (e) {
      console.error(`[Scheduler] ${name} failed:`, e);
    } finally {
      this.inFlight.delete(name);
    }
  }

  /** Cancel pending timeouts for stale services and re-trigger them immediately. */
  flushStale(): void {
    if (!this.hiddenSince) return;
    const hiddenMs = Date.now() - this.hiddenSince;
    this.hiddenSince = 0;

    let stagger = 0;
    for (const [name, { run, intervalMs }] of this.runners) {
      if (hiddenMs < intervalMs) continue;
      const pending = this.timeoutIds.get(name);
      if (pending) clearTimeout(pending);
      const delay = stagger;
      stagger += 150;
      this.timeoutIds.set(name, setTimeout(() => void run(), delay));
    }
  }

  /** Stop all scheduled refreshes and prevent future scheduling. */
  destroy(): void {
    this.destroyed = true;
    for (const id of this.timeoutIds.values()) {
      clearTimeout(id);
    }
    this.timeoutIds.clear();
    this.runners.clear();
    this.inFlight.clear();
  }
}
