import { describe, expect, it } from "vitest";
import { extractCitations, validateAnswer } from "../../lib/assistant/citations";
import { buildCorpus, knownCites } from "../../lib/assistant/corpus";
import { REFUSAL_MESSAGE } from "../../lib/assistant/constants";

describe("extractCitations", () => {
  it("extracts unique bracketed citation ids", () => {
    const answer =
      "Som built RunScope [projects/runscope]. He also worked at AIIRA [experience/aiira-maize-phenotyping] and again [projects/runscope].";
    expect(extractCitations(answer)).toEqual([
      "projects/runscope",
      "experience/aiira-maize-phenotyping",
    ]);
  });

  it("returns an empty array when there are no citations", () => {
    expect(extractCitations("No brackets here.")).toEqual([]);
  });

  it("normalizes a fragment id to its page cite", () => {
    expect(
      extractCitations("RunScope monitors telemetry [projects/runscope#overview]."),
    ).toEqual(["projects/runscope"]);
  });

  it("collapses two fragments of the same page into one citation", () => {
    const answer =
      "It does this [projects/runscope#overview] and that [projects/runscope#built].";
    expect(extractCitations(answer)).toEqual(["projects/runscope"]);
  });
});

// The fixtures above use hand-written ids. Every one of them happens to have
// no fragment, which is exactly why the fragment bug survived to production.
// These build from the real corpus instead.
describe("citations against the real corpus", () => {
  const corpus = buildCorpus();
  const known = knownCites();

  it("has sections whose id carries a fragment", () => {
    expect(corpus.filter((section) => section.id.includes("#")).length)
      .toBeGreaterThan(0);
  });

  it("validates an answer citing any section by its full id", () => {
    for (const section of corpus) {
      const answer = `A claim about it [${section.id}].`;
      expect(
        validateAnswer(answer, known),
        `section ${section.id} could not be cited`,
      ).toEqual({ ok: true, citations: [section.cite] });
    }
  });

  it("still rejects a fragment id on a section that does not exist", () => {
    expect(
      validateAnswer("A claim [projects/not-a-real-project#overview].", known),
    ).toEqual({ ok: false, reason: "unknown-citation" });
  });
});

describe("validateAnswer", () => {
  const known = new Set(["projects/runscope", "skills/build"]);

  it("passes a valid answer with known citations", () => {
    const result = validateAnswer(
      "Som built RunScope [projects/runscope].",
      known,
    );
    expect(result).toEqual({ ok: true, citations: ["projects/runscope"] });
  });

  it("rejects an answer with no citations", () => {
    const result = validateAnswer("Som built RunScope.", known);
    expect(result).toEqual({ ok: false, reason: "no-citations" });
  });

  it("rejects an answer with an unknown citation", () => {
    const result = validateAnswer(
      "Som built RunScope [projects/unknown-project].",
      known,
    );
    expect(result).toEqual({ ok: false, reason: "unknown-citation" });
  });

  it("passes a refusal with no citations required", () => {
    const result = validateAnswer(REFUSAL_MESSAGE, known);
    expect(result).toEqual({ ok: true, citations: [] });
  });
});
