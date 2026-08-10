import { describe, expect, it } from "vitest";
import { cosine, topK } from "../../lib/assistant/similarity";

describe("cosine", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosine([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 10);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosine([1, 0], [0, 1])).toBeCloseTo(0, 10);
  });

  it("throws on length mismatch", () => {
    expect(() => cosine([1, 2], [1, 2, 3])).toThrow();
  });
});

describe("topK", () => {
  const vectors = [
    { id: "a", vector: [1, 0, 0] },
    { id: "b", vector: [0, 1, 0] },
    { id: "c", vector: [0.9, 0.1, 0] },
    { id: "d", vector: [0, 0, 1] },
  ];

  it("orders results by descending score", () => {
    const result = topK([1, 0, 0], vectors, 4);
    expect(result.map((r) => r.id)).toEqual(["a", "c", "b", "d"]);
    expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
    expect(result[1].score).toBeGreaterThanOrEqual(result[2].score);
  });

  it("bounds results to k", () => {
    const result = topK([1, 0, 0], vectors, 2);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id)).toEqual(["a", "c"]);
  });
});
