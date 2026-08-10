import { RATE_LIMIT } from "./constants";

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

// In-memory, per-serverless-instance state: this is NOT a durable global rate
// limit. Each Vercel instance keeps its own Map, so a visitor spread across
// multiple instances can exceed the configured caps in aggregate. Documented
// as an honest limitation in docs/chatbot.md §5; fine as an abuse deterrent
// backed by the provider's own free-tier ceiling.
const hitsByIp = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  now: number = Date.now(),
): { allowed: boolean; retryAfterSec?: number } {
  const hits = (hitsByIp.get(ip) ?? []).filter((t) => now - t < DAY_MS);

  if (hits.length >= RATE_LIMIT.perDay) {
    hitsByIp.set(ip, hits);
    return {
      allowed: false,
      retryAfterSec: Math.ceil((hits[0] + DAY_MS - now) / 1000),
    };
  }

  const minuteHits = hits.filter((t) => now - t < MINUTE_MS);

  if (minuteHits.length >= RATE_LIMIT.perMinute) {
    hitsByIp.set(ip, hits);
    return {
      allowed: false,
      retryAfterSec: Math.ceil((minuteHits[0] + MINUTE_MS - now) / 1000),
    };
  }

  hits.push(now);
  hitsByIp.set(ip, hits);
  return { allowed: true };
}
