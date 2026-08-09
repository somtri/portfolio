import { topK } from "./similarity";
import { TOP_K, MIN_SIMILARITY } from "./constants";
import { EmbeddingsUnavailableError } from "./types";
import type { Section, ContextResult } from "./types";

export async function buildContext(
  question: string,
  deps: {
    corpus: Section[];
    vectors: { id: string; vector: number[] }[] | null;
    embed: (texts: string[]) => Promise<number[][]>;
  },
): Promise<ContextResult> {
  if (deps.vectors === null) {
    return { mode: "full", sections: deps.corpus };
  }

  let questionVector: number[];
  try {
    const [vector] = await deps.embed([question]);
    questionVector = vector;
  } catch (error) {
    if (error instanceof EmbeddingsUnavailableError) {
      return { mode: "full", sections: deps.corpus };
    }
    throw error;
  }

  const ranked = topK(questionVector, deps.vectors, TOP_K).filter(
    (result) => result.score >= MIN_SIMILARITY,
  );

  if (ranked.length === 0) {
    return { mode: "refuse" };
  }

  const sectionById = new Map(
    deps.corpus.map((section) => [section.id, section]),
  );

  const sections = ranked
    .map((result) => {
      const section = sectionById.get(result.id);
      return section ? { section, score: result.score } : null;
    })
    .filter((entry): entry is { section: Section; score: number } => entry !== null);

  return { mode: "retrieved", sections };
}
