import { describe, expect, it } from "vitest";
import { buildCorpus, knownCites } from "../../lib/assistant/corpus";
import { projects } from "../../data/projects";
import { experiences } from "../../data/experience";

describe("buildCorpus", () => {
  const corpus = buildCorpus();

  it("emits unique, non-empty ids", () => {
    const ids = corpus.map((section) => section.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("represents every project slug", () => {
    const cites = new Set(corpus.map((section) => section.cite));
    for (const project of projects) {
      expect(cites.has(`projects/${project.slug}`)).toBe(true);
    }
  });

  it("represents every experience id", () => {
    const cites = new Set(corpus.map((section) => section.cite));
    for (const experience of experiences) {
      expect(cites.has(`experience/${experience.id}`)).toBe(true);
    }
  });

  it("has every cite present in knownCites()", () => {
    const known = knownCites();
    for (const section of corpus) {
      expect(known.has(section.cite)).toBe(true);
    }
  });

  it("has hrefs that all start with /", () => {
    for (const section of corpus) {
      expect(section.href.startsWith("/")).toBe(true);
    }
  });

  it("has no empty section text", () => {
    for (const section of corpus) {
      expect(section.text.trim().length).toBeGreaterThan(0);
    }
  });
});
