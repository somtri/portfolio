import { describe, expect, it } from "vitest";
import { experiences } from "../data/experience";
import {
  formatExperienceDate,
  getExperienceById,
  sortExperiences,
} from "../lib/experience";

describe("experience helpers", () => {
  it("keeps current experience first", () => {
    const sorted = sortExperiences(experiences);

    expect(sorted[0].current).toBe(true);
  });

  it("does not mutate source data while sorting", () => {
    const originalIds = experiences.map((experience) => experience.id);

    sortExperiences(experiences);

    expect(experiences.map((experience) => experience.id)).toEqual(originalIds);
  });

  it("formats month dates for display", () => {
    expect(formatExperienceDate("2025-08")).toBe("Aug 2025");
    expect(formatExperienceDate("2025")).toBe("2025");
  });

  it("contains only resume-backed experience entries", () => {
    expect(experiences).toHaveLength(4);
    expect(experiences.every((experience) => !experience.placeholder)).toBe(
      true,
    );
  });

  it("looks up experience detail pages and preserves the TrAC link", () => {
    const trac = getExperienceById("translational-ai-center-research");

    expect(trac?.title).toContain("Decentralized In-Context Learning");
    expect(trac?.links?.github).toBe(
      "https://github.com/somtri/decentralized_TFM",
    );
  });

  it("uses the current research internship role names", () => {
    const aiira = getExperienceById("aiira-maize-phenotyping");
    const trac = getExperienceById("translational-ai-center-research");

    expect(aiira?.role).toBe("Computer Vision Research Intern");
    expect(trac?.role).toBe("Machine Learning Research Intern");
  });
});
