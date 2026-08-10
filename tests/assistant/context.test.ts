import { describe, expect, it } from "vitest";
import { buildContext } from "../../lib/assistant/context";
import { EmbeddingsUnavailableError } from "../../lib/assistant/types";
import type { Section } from "../../lib/assistant/types";

const corpus: Section[] = [
  {
    id: "projects/x",
    cite: "projects/x",
    href: "/projects/x",
    title: "X",
    text: "section x",
  },
  {
    id: "projects/w",
    cite: "projects/w",
    href: "/projects/w",
    title: "W",
    text: "section w",
  },
  {
    id: "projects/y",
    cite: "projects/y",
    href: "/projects/y",
    title: "Y",
    text: "section y",
  },
];

const vectors = [
  { id: "projects/x", vector: [1, 0, 0] },
  { id: "projects/w", vector: [0.7, 0.7, 0] },
  { id: "projects/y", vector: [0, 1, 0] },
];

describe("buildContext", () => {
  it("ranks the matching section first in retrieved mode", async () => {
    const result = await buildContext("question", {
      corpus,
      vectors,
      embed: async () => [[1, 0, 0]],
    });

    expect(result.mode).toBe("retrieved");
    if (result.mode === "retrieved") {
      expect(result.sections[0].section.id).toBe("projects/x");
      expect(result.sections.map((s) => s.section.id)).toContain(
        "projects/w",
      );
      expect(result.sections.map((s) => s.section.id)).not.toContain(
        "projects/y",
      );
    }
  });

  it("refuses when every score is below the similarity threshold", async () => {
    const result = await buildContext("question", {
      corpus,
      vectors,
      embed: async () => [[0, 0, 1]],
    });

    expect(result.mode).toBe("refuse");
  });

  it("falls back to full mode when embedding is unavailable", async () => {
    const result = await buildContext("which section covers this", {
      corpus,
      vectors,
      embed: async () => {
        throw new EmbeddingsUnavailableError("no key");
      },
    });

    expect(result).toEqual({ mode: "full", sections: corpus });
  });

  it("falls back to full mode when vectors are null", async () => {
    const result = await buildContext("which section covers this", {
      corpus,
      vectors: null,
      embed: async () => [[1, 0, 0]],
    });

    expect(result).toEqual({ mode: "full", sections: corpus });
  });

  // Full mode has no similarity score to refuse on, so without a lexical
  // gate every off-topic question would reach the model with the whole
  // corpus attached.
  it("refuses in full mode when no content word matches the corpus", async () => {
    const result = await buildContext("what is the capital of France", {
      corpus,
      vectors: null,
      embed: async () => [[1, 0, 0]],
    });

    expect(result.mode).toBe("refuse");
  });

  it("refuses in full mode when the embedding call fails on an off-topic question", async () => {
    const result = await buildContext("recommend a good pasta recipe", {
      corpus,
      vectors,
      embed: async () => {
        throw new EmbeddingsUnavailableError("no key");
      },
    });

    expect(result.mode).toBe("refuse");
  });
});
