import { readFileSync } from "node:fs";
import { join } from "node:path";

type VectorEntry = { id: string; vector: number[] };

function isValidShape(value: unknown): value is VectorEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as VectorEntry).id === "string" &&
        Array.isArray((entry as VectorEntry).vector) &&
        (entry as VectorEntry).vector.every((n) => typeof n === "number"),
    )
  );
}

export function loadVectors(): VectorEntry[] | null {
  try {
    const filePath = join(process.cwd(), "lib", "assistant", "vectors.json");
    const raw = readFileSync(filePath, "utf-8");
    const parsed: unknown = JSON.parse(raw);

    if (!isValidShape(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
