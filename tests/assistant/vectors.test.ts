import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildCorpus } from "../../lib/assistant/corpus";
import { corpusHash } from "../../lib/assistant/corpusHash";

const META_PATH = join(process.cwd(), "lib", "assistant", "vectors.meta.json");
const VECTORS_PATH = join(process.cwd(), "lib", "assistant", "vectors.json");

// Retrieval is opt-in: with no embeddings committed the assistant runs the
// full-context fallback, which is a supported state, so these skip rather
// than fail. Once `pnpm embed` has run, they guard the committed artefact.
const embeddingsCommitted = existsSync(META_PATH);

describe("committed embeddings", () => {
  it.skipIf(!embeddingsCommitted)(
    "were built from the current corpus",
    () => {
      const meta: unknown = JSON.parse(readFileSync(META_PATH, "utf-8"));
      const recorded = (meta as { corpusHash?: string }).corpusHash;

      expect(recorded).toBe(corpusHash(buildCorpus()));
    },
  );

  it.skipIf(!embeddingsCommitted)("cover every section exactly once", () => {
    const vectors: unknown = JSON.parse(readFileSync(VECTORS_PATH, "utf-8"));
    const ids = (vectors as { id: string }[]).map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(
      buildCorpus()
        .map((section) => section.id)
        .sort(),
    );
  });
});
