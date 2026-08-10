import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildCorpus } from "../lib/assistant/corpus";
import { corpusHash } from "../lib/assistant/corpusHash";
import { embedTexts } from "../lib/assistant/embeddings";
import { EmbeddingsUnavailableError } from "../lib/assistant/types";

const BATCH_SIZE = 50;

async function main() {
  const corpus = buildCorpus();
  const vectors: { id: string; vector: number[] }[] = [];

  for (let i = 0; i < corpus.length; i += BATCH_SIZE) {
    const batch = corpus.slice(i, i + BATCH_SIZE);
    const embeddings = await embedTexts(batch.map((section) => section.text));
    batch.forEach((section, index) => {
      vectors.push({ id: section.id, vector: embeddings[index] });
    });
  }

  const outPath = join(process.cwd(), "lib", "assistant", "vectors.json");
  writeFileSync(outPath, JSON.stringify(vectors));

  // Both files are committed. The hash lets a test catch vectors that no
  // longer match the content they were built from.
  const metaPath = join(process.cwd(), "lib", "assistant", "vectors.meta.json");
  const dims = vectors[0]?.vector.length ?? 0;
  writeFileSync(
    metaPath,
    JSON.stringify({ corpusHash: corpusHash(corpus), sections: vectors.length, dims }, null, 2) + "\n",
  );

  console.log(
    `Embedded ${vectors.length} sections at ${dims} dimensions -> ${outPath}`,
  );
  console.log("Commit both vectors.json and vectors.meta.json.");
}

main().catch((error: unknown) => {
  if (error instanceof EmbeddingsUnavailableError) {
    console.error(
      `Embedding failed: ${error.message}. Set EMBEDDINGS_ACCOUNT_ID and EMBEDDINGS_API_TOKEN (and optionally EMBEDDINGS_MODEL), then retry.`,
    );
  } else {
    console.error(error);
  }
  process.exit(1);
});
