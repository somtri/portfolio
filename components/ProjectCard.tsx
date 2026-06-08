import Link from "next/link";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  index?: number;
  compact?: boolean;
};

export function ProjectCard({
  project,
  index,
  compact = false,
}: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col border border-black bg-[var(--surface)] transition duration-150 hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[7px_7px_0_var(--shadow-muted)]">
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col p-5 sm:p-6"
        aria-label={`Open project: ${project.title}`}
      >
        <div className="flex items-start justify-between gap-4 font-mono text-[0.68rem] font-bold uppercase tracking-wider">
          <span>{index !== undefined ? String(index).padStart(2, "0") : "PX"}</span>
          <span>{project.year}</span>
        </div>

        <h2
          className={`${compact ? "text-xl" : "text-2xl"} mt-10 font-mono font-black uppercase leading-tight tracking-[-0.035em]`}
        >
          {project.title}
        </h2>
        <p className="text-pretty mt-3 leading-7 text-[var(--muted)] group-hover:text-zinc-300">
          {project.oneLine}
        </p>

        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-wider text-[var(--muted)] group-hover:text-zinc-400">
            {project.techStack.slice(0, compact ? 3 : 4).map((tech) => (
              <span key={tech}>+ {tech}</span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-current pt-3 font-mono text-xs font-bold uppercase tracking-wider">
            <span>Open project</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
