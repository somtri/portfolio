import { chatComplete } from "./assistant/chat";

// Curated fallback tails — each completes "currently training models and
// ___", so the whole predicate rotates, not just its object. Ships live until
// API keys land in Vercel, and every failure path in getFortuneTail() falls
// back here. Content owner-curated.
export const CURATED_TAILS: readonly string[] = [
  "arguing with opus 5",
  "losing to a race condition",
  "waiting on a cold build",
  "re-running one flaky test",
  "blaming the cache",
  "rereading my own commits",
  "negotiating with a gpu queue",
  "chasing an off-by-one",
  "apologizing to the type checker",
  "untangling a cursed regex",
  "watching a loss curve flatline",
  "waiting on one more epoch",
  "debugging the data not the model",
  "arguing with a stack trace",
  "trusting one more random seed",
  "reading docs that lied",
] as const;

const HN_KEYWORDS = [
  "ai",
  "ml",
  "llm",
  "gpt",
  "claude",
  "openai",
  "anthropic",
  "model",
  "neural",
  "transformer",
  "diffusion",
  "inference",
  "gpu",
  "cuda",
  "pytorch",
  "quant",
  "trading",
  "hedge fund",
  "market",
];

const HN_TIMEOUT_MS = 4000;
const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60;

const FORTUNE_SYSTEM_PROMPT =
  "Given one news headline, reply with a 2-6 word phrase that completes " +
  '"currently training models and ___". Start with a verb ending in -ing, ' +
  "e.g. \"arguing with opus 5\". Lowercase, no punctuation, no quotes, no " +
  "explanation — the phrase only.";

/**
 * ISO-8601 week number + week-year for a given date, computed in UTC.
 * Standard algorithm: shift to the Thursday of the current week, then
 * measure weeks from the first Thursday of that Thursday's year.
 */
function getIsoWeek(date: Date): { year: number; week: number } {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = (d.getUTCDay() + 6) % 7; // Monday = 0 ... Sunday = 6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // Thursday of this ISO week

  const isoYear = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);

  const week =
    1 +
    Math.round(
      (d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

  return { year: isoYear, week };
}

/** Deterministic by ISO week: stable within a week, differs across weeks. */
export function pickCuratedTail(date: Date): string {
  const { year, week } = getIsoWeek(date);
  const index =
    (((year * 53 + week) % CURATED_TAILS.length) + CURATED_TAILS.length) %
    CURATED_TAILS.length;
  return CURATED_TAILS[index];
}

const VALID_TAIL_PATTERN = /^[a-z0-9 .'+#-]+$/;

/**
 * The safety gate. Whatever this passes goes live on the owner's portfolio,
 * unreviewed, for a week. Default to rejecting.
 */
export function isValidTail(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed.length < 4 || trimmed.length > 40) {
    return false;
  }

  const words = trimmed.split(/\s+/);
  if (words.length < 2 || words.length > 6) {
    return false;
  }

  if (!VALID_TAIL_PATTERN.test(trimmed)) {
    return false;
  }

  if (trimmed.includes("http")) {
    return false;
  }

  return true;
}

function normalizeQuip(raw: string): string {
  let value = raw.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  return value.toLowerCase();
}

function isBareCopyOfHeadline(quip: string, headline: string): boolean {
  const normalizedHeadline = headline.trim().toLowerCase();
  return (
    quip === normalizedHeadline ||
    (quip.length > 8 && normalizedHeadline.includes(quip))
  );
}

function isChatConfigured(): boolean {
  return Boolean(
    process.env.ASSISTANT_BASE_URL &&
      process.env.ASSISTANT_MODEL &&
      process.env.ASSISTANT_API_KEY,
  );
}

function matchesHnKeyword(title: string): boolean {
  const lower = title.toLowerCase();
  return HN_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function buildHnUrl(now: Date): string {
  const unixSecondsOneWeekAgo =
    Math.floor(now.getTime() / 1000) - ONE_WEEK_SECONDS;
  return (
    "https://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=" +
    `points%3E50,created_at_i%3E${unixSecondsOneWeekAgo}&hitsPerPage=50`
  );
}

/**
 * Fetches the highest-points AI/ML/quant headline from the past week.
 * Throws on any error, non-200, timeout, or empty match set — callers
 * treat every throw as "fall back to the curated list".
 */
async function fetchTopHeadline(now: Date): Promise<string> {
  const response = await fetch(buildHnUrl(now), {
    signal: AbortSignal.timeout(HN_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`HN request returned status ${response.status}`);
  }

  const body = (await response.json()) as { hits?: unknown };
  const hits = Array.isArray(body.hits) ? body.hits : [];

  const matches = hits.filter(
    (hit): hit is { title: string; points: number } =>
      typeof hit === "object" &&
      hit !== null &&
      typeof (hit as { title?: unknown }).title === "string" &&
      typeof (hit as { points?: unknown }).points === "number" &&
      matchesHnKeyword((hit as { title: string }).title),
  );

  if (matches.length === 0) {
    throw new Error("No AI/ML/quant headlines found in the past week");
  }

  matches.sort((a, b) => b.points - a.points);
  return matches[0].title;
}

/**
 * Orchestrates the weekly fortune tail. Never throws and never returns an
 * invalid value — every failure path falls back to pickCuratedTail(now).
 */
export async function getFortuneTail(now: Date = new Date()): Promise<string> {
  const fallback = pickCuratedTail(now);

  if (!isChatConfigured()) {
    return fallback;
  }

  let headline: string;
  try {
    headline = await fetchTopHeadline(now);
  } catch {
    return fallback;
  }

  let raw: string;
  try {
    raw = await chatComplete({
      system: FORTUNE_SYSTEM_PROMPT,
      user: `Headline: ${headline}`,
    });
  } catch {
    return fallback;
  }

  const quip = normalizeQuip(raw);

  if (!isValidTail(quip) || isBareCopyOfHeadline(quip, headline)) {
    return fallback;
  }

  return quip;
}
