import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import { getFeaturedProjects, getProjectBySlug } from "../lib/projects";

describe("project helpers", () => {
  it("looks up a project by slug", () => {
    expect(getProjectBySlug("runscope")?.title).toBe("RunScope");
    expect(getProjectBySlug("poke327")?.title).toBe("Poke327");
    expect(getProjectBySlug("personal-portfolio")?.title).toBe(
      "Personal Portfolio Website",
    );
    expect(getProjectBySlug("missing-project")).toBeUndefined();
  });

  it("limits featured projects", () => {
    const featured = getFeaturedProjects(3);

    expect(featured).toHaveLength(3);
    expect(featured.every((project) => project.featured)).toBe(true);
  });

  it("places the portfolio directly after Poke327", () => {
    const pokeIndex = projects.findIndex((project) => project.slug === "poke327");

    expect(projects[pokeIndex + 1]?.slug).toBe("personal-portfolio");
  });

  it("preserves the required modeling caveats", () => {
    const smartSignal = getProjectBySlug("smartsignal");
    const cineMl = getProjectBySlug("cineml");
    const macroMarkets = getProjectBySlug("macromarkets-ml");

    expect(smartSignal?.results?.join(" ")).toContain(
      "deterministic market-like simulation",
    );
    expect(cineMl?.results?.join(" ")).toContain(
      "post-release cross-platform rating estimator",
    );
    expect(macroMarkets?.results?.join(" ")).toContain(
      "did not show useful next-month directional signal",
    );
  });

  it("provides a public GitHub repository for every project", () => {
    const slugs = [
      "runscope",
      "smartsignal",
      "poke327",
      "personal-portfolio",
      "cineml",
      "macromarkets-ml",
    ];

    expect(
      slugs.every((slug) =>
        getProjectBySlug(slug)?.links.github.startsWith(
          "https://github.com/somtri/",
        ),
      ),
    ).toBe(true);
  });
});
