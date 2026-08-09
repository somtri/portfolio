import { describe, expect, it } from "vitest";
import { extractCitations, validateAnswer } from "../../lib/assistant/citations";
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
