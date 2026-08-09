import { REFUSAL_MESSAGE } from "./constants";
import type { Section, RetrievedSection } from "./types";

function isRetrievedSections(
  sections: Section[] | RetrievedSection[],
): sections is RetrievedSection[] {
  return sections.length > 0 && "section" in sections[0];
}

export function buildSystemPrompt(
  sections: Section[] | RetrievedSection[],
): string {
  const plainSections = isRetrievedSections(sections)
    ? sections.map((entry) => entry.section)
    : sections;

  const serialized = plainSections
    .map((section) => `## ${section.id} — ${section.title}\n${section.text}`)
    .join("\n\n");

  return [
    "You are the assistant on Som Tripathi's portfolio site.",
    "Answer ONLY using the sections provided below. Do not use outside knowledge and never speculate about Som.",
    "After each claim, cite the section id it came from in brackets, like [projects/runscope].",
    `If the sections do not answer the question, reply with exactly this message and nothing else: "${REFUSAL_MESSAGE}"`,
    "Keep answers concise.",
    "",
    "Sections:",
    serialized,
  ].join("\n");
}
