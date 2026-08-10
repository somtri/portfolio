import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Key handling is correct today by construction rather than by check: nothing
// asserts it, so a future edit could expose a provider key and every other
// test would still pass. This file is that assertion.

const SOURCE_DIRS = ["app", "components", "lib", "data", "types", "scripts"];
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"];

const SECRET_VARS = [
  "ASSISTANT_API_KEY",
  "EMBEDDINGS_ACCOUNT_ID",
  "EMBEDDINGS_API_TOKEN",
];

// Prefixes real provider keys carry. A template like `Bearer ${apiKey}` does
// not match: the interpolation braces are outside every character class.
const KEY_SHAPED = [
  /\bgsk_[A-Za-z0-9]{20,}/,
  /\bnvapi-[A-Za-z0-9_-]{20,}/,
  /\bsk-[A-Za-z0-9]{32,}/,
  /\bBearer\s+[A-Za-z0-9._-]{24,}/,
];

function sourceFiles(): string[] {
  const found: string[] = [];

  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (SOURCE_EXTENSIONS.some((ext) => entry.endsWith(ext))) {
        found.push(full);
      }
    }
  }

  for (const dir of SOURCE_DIRS) {
    walk(join(process.cwd(), dir));
  }

  return found;
}

const files = sourceFiles().map((path) => ({
  path: relative(process.cwd(), path),
  text: readFileSync(path, "utf8"),
}));

describe("assistant secrets", () => {
  it("finds source files to check", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("never exposes an assistant variable to the browser bundle", () => {
    const offenders = files.filter((file) =>
      /NEXT_PUBLIC_[A-Z0-9_]*(ASSISTANT|EMBEDDINGS)/.test(file.text),
    );
    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it("keeps provider variables out of client components", () => {
    const offenders = files.filter(
      (file) =>
        /^\s*["']use client["']/m.test(file.text) &&
        /process\.env\.(ASSISTANT|EMBEDDINGS)_/.test(file.text),
    );
    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it("has no key-shaped literal anywhere in the source", () => {
    const offenders = files.filter((file) =>
      KEY_SHAPED.some((pattern) => pattern.test(file.text)),
    );
    expect(offenders.map((file) => file.path)).toEqual([]);
  });

  it("ships .env.example with names only, never values", () => {
    const example = readFileSync(join(process.cwd(), ".env.example"), "utf8");
    for (const name of SECRET_VARS) {
      const line = example
        .split(/\r?\n/)
        .find((entry) => entry.startsWith(`${name}=`));
      expect(line, `${name} is missing from .env.example`).toBeDefined();
      expect(line, `${name} has a value committed`).toBe(`${name}=`);
    }
  });

  it("keeps .env files gitignored apart from the example", () => {
    const gitignore = readFileSync(join(process.cwd(), ".gitignore"), "utf8");
    const rules = gitignore.split(/\r?\n/).map((line) => line.trim());
    expect(rules).toContain(".env*");
    expect(rules).toContain("!.env.example");
    expect(rules.filter((rule) => rule.startsWith("!.env"))).toEqual([
      "!.env.example",
    ]);
  });
});
