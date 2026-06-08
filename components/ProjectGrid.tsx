import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types/project";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={index + 1}
          compact
        />
      ))}
    </div>
  );
}
