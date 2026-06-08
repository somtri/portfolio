import { projects } from "../data/projects";
import type { Project } from "../types/project";

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(limit = 4): Project[] {
  return projects.filter((project) => project.featured).slice(0, limit);
}
