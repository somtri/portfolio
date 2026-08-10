import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CURATED_TAILS,
  getFortuneTail,
  isValidTail,
  pickCuratedTail,
} from "../lib/fortune";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("pickCuratedTail", () => {
  it("is stable for two dates in the same ISO week", () => {
    const monday = new Date("2024-01-08T12:00:00Z");
    const wednesday = new Date("2024-01-10T12:00:00Z");
    expect(pickCuratedTail(monday)).toBe(pickCuratedTail(wednesday));
  });

  it("differs across distant ISO weeks", () => {
    const week2024 = new Date("2024-01-10T12:00:00Z");
    const week2030 = new Date("2030-06-15T12:00:00Z");
    expect(pickCuratedTail(week2024)).not.toBe(pickCuratedTail(week2030));
  });

  it("returns a member of CURATED_TAILS for a spread of dates across a year", () => {
    for (let month = 0; month < 12; month++) {
      const date = new Date(Date.UTC(2026, month, 15));
      expect(CURATED_TAILS).toContain(pickCuratedTail(date));
    }
  });
});

describe("isValidTail", () => {
  it("accepts a good quip", () => {
    expect(isValidTail("a stack trace")).toBe(true);
  });

  it("rejects a value over 28 characters", () => {
    expect(isValidTail("a very long winded philosophical debate")).toBe(
      false,
    );
  });

  it("rejects more than 4 words", () => {
    expect(isValidTail("a b c d e")).toBe(false);
  });

  it("rejects uppercase", () => {
    expect(isValidTail("A Stack Trace")).toBe(false);
  });

  it("rejects punctuation and markup", () => {
    expect(isValidTail("a stack trace!")).toBe(false);
    expect(isValidTail("<b>a stack trace</b>")).toBe(false);
  });

  it("rejects a URL", () => {
    expect(isValidTail("http://example.com")).toBe(false);
  });

  it("rejects an empty value", () => {
    expect(isValidTail("")).toBe(false);
    expect(isValidTail("   ")).toBe(false);
  });
});

describe("getFortuneTail", () => {
  it("returns a curated tail and performs no fetch when no key is configured", async () => {
    vi.stubEnv("ASSISTANT_BASE_URL", "");
    vi.stubEnv("ASSISTANT_MODEL", "");
    vi.stubEnv("ASSISTANT_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const now = new Date("2026-08-09T12:00:00Z");
    const tail = await getFortuneTail(now);

    expect(CURATED_TAILS).toContain(tail);
    expect(tail).toBe(pickCuratedTail(now));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  function configureChatEnv() {
    vi.stubEnv("ASSISTANT_BASE_URL", "https://example.com/v1");
    vi.stubEnv("ASSISTANT_MODEL", "test-model");
    vi.stubEnv("ASSISTANT_API_KEY", "test-key");
  }

  it("falls back to curated when the HN fetch rejects", async () => {
    configureChatEnv();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    const now = new Date("2026-08-09T12:00:00Z");
    const tail = await getFortuneTail(now);

    expect(tail).toBe(pickCuratedTail(now));
  });

  it("falls back to curated when the HN response is non-200", async () => {
    configureChatEnv();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }) as Response),
    );

    const now = new Date("2026-08-09T12:00:00Z");
    const tail = await getFortuneTail(now);

    expect(tail).toBe(pickCuratedTail(now));
  });

  it("falls back to curated when HN hits are empty (or match no keywords)", async () => {
    configureChatEnv();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ hits: [] }),
      })) as unknown as typeof fetch,
    );

    const now = new Date("2026-08-09T12:00:00Z");
    const tail = await getFortuneTail(now);

    expect(tail).toBe(pickCuratedTail(now));
  });

  it("falls back to curated when the model returns something isValidTail rejects", async () => {
    configureChatEnv();
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = input.toString();
      if (url.includes("hn.algolia.com")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            hits: [{ title: "New AI model beats every benchmark", points: 200 }],
          }),
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  "this is a way too long response with far more than four words",
              },
            },
          ],
        }),
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);

    const now = new Date("2026-08-09T12:00:00Z");
    const tail = await getFortuneTail(now);

    expect(tail).toBe(pickCuratedTail(now));
  });

  it("returns the validated quip when everything succeeds", async () => {
    configureChatEnv();
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = input.toString();
      if (url.includes("hn.algolia.com")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            hits: [{ title: "New AI model beats every benchmark", points: 200 }],
          }),
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: '"a stubborn benchmark"' } }],
        }),
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);

    const now = new Date("2026-08-09T12:00:00Z");
    const tail = await getFortuneTail(now);

    expect(tail).toBe("a stubborn benchmark");
  });
});
