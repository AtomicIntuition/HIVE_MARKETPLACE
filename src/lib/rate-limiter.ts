interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

class SlidingWindowRateLimiter {
  private windows = new Map<string, number[]>();

  check(id: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const cutoff = now - windowMs;

    let timestamps = this.windows.get(id);
    if (timestamps) {
      timestamps = timestamps.filter((t) => t > cutoff);
      this.windows.set(id, timestamps);
    } else {
      timestamps = [];
    }

    if (timestamps.length >= limit) {
      const oldest = timestamps[0];
      return { allowed: false, remaining: 0, resetAt: oldest + windowMs };
    }

    timestamps.push(now);
    this.windows.set(id, timestamps);

    return {
      allowed: true,
      remaining: limit - timestamps.length,
      resetAt: now + windowMs,
    };
  }

  /** Periodic cleanup to prevent memory leaks in long-running processes */
  cleanup(windowMs: number) {
    const cutoff = Date.now() - windowMs;
    for (const [id, timestamps] of this.windows) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) {
        this.windows.delete(id);
      } else {
        this.windows.set(id, filtered);
      }
    }
  }
}

// Singleton: 10 reviews per hour per API key
export const reviewRateLimiter = new SlidingWindowRateLimiter();
export const REVIEW_RATE_LIMIT = 10;
export const REVIEW_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
