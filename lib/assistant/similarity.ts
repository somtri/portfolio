export function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(
      `cosine: vector length mismatch (${a.length} vs ${b.length})`,
    );
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function topK(
  query: number[],
  vectors: { id: string; vector: number[] }[],
  k: number,
): { id: string; score: number }[] {
  return vectors
    .map(({ id, vector }) => ({ id, score: cosine(query, vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
