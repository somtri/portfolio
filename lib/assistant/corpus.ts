import { profile } from "../../data/profile";
import { skillGroups } from "../../data/skills";
import { projects } from "../../data/projects";
import { experiences } from "../../data/experience";
import { resumeSections } from "../../data/resume";
import type { Section } from "./types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeSection(
  id: string,
  href: string,
  title: string,
  text: string,
): Section {
  return { id, cite: id.split("#")[0], href, title, text };
}

function buildProfileSection(): Section {
  const text = [
    `${profile.name} — ${profile.title}.`,
    `Location: ${profile.location}. University: ${profile.university}.`,
    profile.shortBio,
    profile.longBio,
    `Focus areas: ${profile.focusAreas.join(", ")}.`,
    `Target roles: ${profile.targetRoles.join(", ")}.`,
  ].join(" ");

  return makeSection("profile/main", "/", "Profile", text);
}

function buildSkillSections(): Section[] {
  return skillGroups.map((group) => {
    const id = `skills/${slugify(group.label)}`;
    const text = `Skills — ${group.label}: ${group.items.join(", ")}.`;
    return makeSection(id, "/", `Skills — ${group.label}`, text);
  });
}

function buildProjectSections(): Section[] {
  const sections: Section[] = [];

  for (const project of projects) {
    const href = `/projects/${project.slug}`;
    const context = `${project.title} — ${project.category}${project.year ? ` (${project.year})` : ""}.`;

    sections.push(
      makeSection(
        `projects/${project.slug}#overview`,
        href,
        `${project.title} — Overview`,
        `${context} ${project.overview}`,
      ),
    );
    sections.push(
      makeSection(
        `projects/${project.slug}#problem`,
        href,
        `${project.title} — Problem`,
        `${context} ${project.problem}`,
      ),
    );
    sections.push(
      makeSection(
        `projects/${project.slug}#built`,
        href,
        `${project.title} — Built`,
        `${context} ${project.built.join(" ")}`,
      ),
    );
    if (project.results && project.results.length > 0) {
      sections.push(
        makeSection(
          `projects/${project.slug}#results`,
          href,
          `${project.title} — Results`,
          `${context} ${project.results.join(" ")}`,
        ),
      );
    }
    sections.push(
      makeSection(
        `projects/${project.slug}#focus`,
        href,
        `${project.title} — Technical Focus`,
        `${context} ${project.technicalFocus}`,
      ),
    );
    sections.push(
      makeSection(
        `projects/${project.slug}#stack`,
        href,
        `${project.title} — Tech Stack`,
        `${context} Tech stack: ${project.techStack.join(", ")}.`,
      ),
    );
  }

  return sections;
}

function buildExperienceSections(): Section[] {
  const sections: Section[] = [];

  for (const experience of experiences) {
    const href = `/experience/${experience.id}`;
    const context = `${experience.title} — ${experience.role}, ${experience.organization}.`;

    sections.push(
      makeSection(
        `experience/${experience.id}#overview`,
        href,
        `${experience.title} — Overview`,
        `${context} ${experience.overview}`,
      ),
    );
    sections.push(
      makeSection(
        `experience/${experience.id}#work`,
        href,
        `${experience.title} — Work`,
        `${context} ${experience.bullets.join(" ")}`,
      ),
    );
    sections.push(
      makeSection(
        `experience/${experience.id}#focus`,
        href,
        `${experience.title} — Technical Focus`,
        `${context} ${experience.technicalFocus}`,
      ),
    );
    sections.push(
      makeSection(
        `experience/${experience.id}#stack`,
        href,
        `${experience.title} — Tech Stack`,
        `${context} Tech stack: ${experience.techStack.join(", ")}.`,
      ),
    );
    if (experience.pipeline && experience.pipeline.length > 0) {
      sections.push(
        makeSection(
          `experience/${experience.id}#pipeline`,
          href,
          `${experience.title} — Pipeline`,
          `${context} Pipeline: ${experience.pipeline.join(" -> ")}.`,
        ),
      );
    }
  }

  return sections;
}

function buildResumeSections(): Section[] {
  return resumeSections.map((resumeSection) => {
    const id = `resume/${slugify(resumeSection.title)}`;
    const items = resumeSection.items
      .map((item) => `${item.heading} (${item.meta}): ${item.details.join(" ")}`)
      .join(" ");
    const text = `Resume — ${resumeSection.title}. ${items}`;
    return makeSection(id, "/resume", `Resume — ${resumeSection.title}`, text);
  });
}

export function buildCorpus(): Section[] {
  return [
    buildProfileSection(),
    ...buildSkillSections(),
    ...buildProjectSections(),
    ...buildExperienceSections(),
    ...buildResumeSections(),
  ];
}

export function knownCites(): Set<string> {
  return new Set(buildCorpus().map((section) => section.cite));
}
