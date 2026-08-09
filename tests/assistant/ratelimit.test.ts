import { describe, expect, it } from "vitest";
import { checkRateLimit } from "../../lib/assistant/ratelimit";

describe("checkRateLimit", () => {
  it("allows up to 5 requests in a minute", () => {
    const now = 1_000;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("ip-a", now).allowed).toBe(true);
    }
  });

  it("blocks the 6th request in the same minute with a retryAfterSec", () => {
    const now = 2_000;
    for (let i = 0; i < 5; i++) {
      checkRateLimit("ip-b", now);
    }
    const result = checkRateLimit("ip-b", now);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it("allows requests again once the minute window slides", () => {
    const start = 0;
    for (let i = 0; i < 5; i++) {
      checkRateLimit("ip-c", start);
    }
    expect(checkRateLimit("ip-c", start).allowed).toBe(false);

    const later = start + 61_000;
    expect(checkRateLimit("ip-c", later).allowed).toBe(true);
  });

  it("blocks after 25 requests in a day even when spread across minutes", () => {
    const start = 0;
    const minuteApart = 61_000;

    for (let i = 0; i < 25; i++) {
      const result = checkRateLimit("ip-d", start + i * minuteApart);
      expect(result.allowed).toBe(true);
    }

    const result = checkRateLimit("ip-d", start + 25 * minuteApart);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });
});
