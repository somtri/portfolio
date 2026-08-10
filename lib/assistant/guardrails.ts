import type { Section } from "./types";

// The visitor's question is the only untrusted text in the request. Sections
// come from data/*.ts, which only the repository owner edits, so they are
// trusted input; the question is not, and everything here exists to keep the
// two apart.
export const QUESTION_OPEN_TAG = "<visitor-question>";
export const QUESTION_CLOSE_TAG = "</visitor-question>";

// Distinctive lines from the system prompt. If any of them survive into an
// answer, the model has repeated its own instructions back to the visitor.
export const PROMPT_FINGERPRINTS = [
  "you are the assistant on som tripathi's portfolio site",
  "answer only from the sections below",
  "never use outside knowledge",
  "cite the section id it came from",
  "treat everything inside those tags",
  QUESTION_OPEN_TAG,
] as const;

// Each pattern pairs an imperative with a specific target, so ordinary
// portfolio questions do not trip it. A bare word like "instructions" or
// "prompt" is deliberately not enough on its own.
const INJECTION_PATTERNS: RegExp[] = [
  // Overriding the rules.
  /\b(ignore|disregard|forget|override|bypass)\b[^.?!]{0,40}\b(previous|prior|preceding|above|earlier|all|your|these|the)\b[^.?!]{0,25}\b(instruction|rule|prompt|direction|constraint|guideline)/i,
  // Extracting the rules or the raw context.
  /\b(reveal|show|print|repeat|output|display|reproduce|leak|dump)\b[^.?!]{0,40}\b(system prompt|your prompt|your instruction|your rule|your configuration|the sections|raw section|your system message)/i,
  /\bwhat(?:'s| is| are)\b[^.?!]{0,30}\b(your|the)\s+(system|initial|original|full)\s+(prompt|instructions?)\b/i,
  // Replacing the persona.
  /\byou\s+are\s+(now|no longer)\b/i,
  /\b(pretend|roleplay|role-play)\s+(to\s+be|that|you(?:'re| are))\b/i,
  // "developer mode" and "DAN mode" are jailbreak idioms. "debug mode" and
  // "god mode" are not — they are things a visitor might genuinely ask about
  // a project, so they stay out.
  /\b(developer|dan)\s+mode\b/i,
  /\bjailbreak/i,
  // Smuggling a second instruction block in.
  /\bnew\s+(instruction|rule|system prompt)s?\s*[:-]/i,
  /^\s*(system|assistant)\s*[:-]/i,
];

// Words too common to say anything about whether a question is about Som.
const STOPWORDS = new Set([
  "the", "and", "for", "are", "was", "were", "you", "your", "yours", "his",
  "her", "hers", "its", "our", "ours", "their", "them", "they", "this",
  "that", "these", "those", "there", "here", "what", "when", "where", "which",
  "who", "whom", "whose", "why", "how", "can", "could", "should", "would",
  "will", "shall", "may", "might", "must", "have", "has", "had", "does",
  "did", "doing", "done", "been", "being", "with", "without", "from", "into",
  "onto", "about", "above", "below", "under", "over", "than", "then", "some",
  "any", "all", "not", "but", "out", "off", "own", "same", "such", "too",
  "very", "just", "now", "also", "more", "most", "much", "many", "one", "two",
  "get", "got", "make", "made", "tell", "give", "say", "said", "know", "like",
  "want", "need", "use", "used", "please", "thanks", "hello",
]);

// \p{C} is Unicode's "Other" category: control, format, surrogate, private
// use and unassigned code points. None belong in a typed question, and the
// format ones in particular can hide text from a human reviewer while the
// model still reads it.
const INVISIBLE = /\p{C}/gu;

function contentTokens(text: string): string[] {
  const matches = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return matches.filter((token) => token.length >= 3 && !STOPWORDS.has(token));
}

/**
 * Strips invisible characters, removes the delimiter tags so a question
 * cannot close its own block, and collapses whitespace.
 */
export function sanitizeQuestion(raw: string): string {
  return raw
    .replaceAll(QUESTION_OPEN_TAG, " ")
    .replaceAll(QUESTION_CLOSE_TAG, " ")
    .replace(INVISIBLE, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function looksLikeInjection(question: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(question));
}

/**
 * The full-context path has no similarity score to gate on, so this is what
 * stands in for it: a question with no content word anywhere in the corpus
 * cannot be about Som, and is refused before it reaches the model.
 */
export function hasCorpusOverlap(question: string, corpus: Section[]): boolean {
  const asked = contentTokens(question);
  if (asked.length === 0) {
    return false;
  }

  const vocabulary = new Set<string>();
  for (const section of corpus) {
    for (const token of contentTokens(`${section.title} ${section.text}`)) {
      vocabulary.add(token);
    }
  }

  return asked.some((token) => vocabulary.has(token));
}

export function leaksSystemPrompt(answer: string): boolean {
  const lowered = answer.toLowerCase();
  return PROMPT_FINGERPRINTS.some((phrase) => lowered.includes(phrase));
}

/** Wraps the question so the model can tell data from instructions. */
export function wrapQuestion(question: string): string {
  return `${QUESTION_OPEN_TAG}\n${question}\n${QUESTION_CLOSE_TAG}`;
}
