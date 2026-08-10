export const TOP_K = 8;

function parseMinSimilarity(): number {
  const raw = process.env.ASSISTANT_MIN_SIMILARITY;
  if (!raw) {
    return 0.4;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return 0.4;
  }

  return parsed;
}

export const MIN_SIMILARITY = parseMinSimilarity();

export const MAX_QUESTION_CHARS = 500;

export const MAX_ANSWER_TOKENS = 512;

export const RATE_LIMIT = {
  perMinute: 5,
  perDay: 25,
} as const;

export const REFUSAL_MESSAGE =
  "I don't know — that isn't covered by Som's portfolio content. Try asking about his projects, experience, skills, or resume.";
