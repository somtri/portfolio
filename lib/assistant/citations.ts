import { REFUSAL_MESSAGE } from "./constants";

const CITATION_PATTERN = /\[([a-z0-9-]+(?:\/[a-z0-9-]+)?)\]/g;

export function extractCitations(answer: string): string[] {
  const found = new Set<string>();

  for (const match of answer.matchAll(CITATION_PATTERN)) {
    found.add(match[1]);
  }

  return [...found];
}

export type ValidateAnswerResult =
  | { ok: true; citations: string[] }
  | { ok: false; reason: "no-citations" | "unknown-citation" };

export function validateAnswer(
  answer: string,
  known: Set<string>,
): ValidateAnswerResult {
  if (answer.includes(REFUSAL_MESSAGE)) {
    return { ok: true, citations: [] };
  }

  const citations = extractCitations(answer);

  if (citations.length === 0) {
    return { ok: false, reason: "no-citations" };
  }

  if (!citations.every((cite) => known.has(cite))) {
    return { ok: false, reason: "unknown-citation" };
  }

  return { ok: true, citations };
}
