import Link from "next/link";
import type { Experience } from "@/types/experience";
import { formatExperienceDate } from "@/lib/experience";
import { Tag } from "@/components/ui/Tag";

type ExperienceCardProps = {
  experience: Experience;
  index: number;
};

export function ExperienceCard({
  experience,
  index,
}: ExperienceCardProps) {
  const end = experience.current
    ? "Present"
    : experience.endDate
      ? formatExperienceDate(experience.endDate)
      : "";

  return (
    <article className="group relative border border-black bg-[var(--surface)] transition duration-150 hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-[7px_7px_0_var(--shadow-muted)]">
      <span
        aria-hidden="true"
        className="absolute -left-[2.68rem] top-7 hidden h-4 w-4 border border-black bg-black md:block"
      />
      <Link
        href={`/experience/${experience.id}`}
        className="block p-5 sm:p-7"
        aria-label={`Open experience details: ${experience.organization} - ${experience.role}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="max-w-4xl font-mono text-xl font-black uppercase leading-tight tracking-[-0.03em] sm:text-2xl">
              {experience.organization}
            </h2>
            <p className="mt-3 font-semibold">{experience.role}</p>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--muted)] group-hover:text-zinc-400">
            {String(index).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--muted)] group-hover:text-zinc-400">
          {formatExperienceDate(experience.startDate)} - {end}
          {experience.location ? ` / ${experience.location}` : ""}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Tag className="group-hover:border-white group-hover:text-white">
            {experience.category}
          </Tag>
          {experience.current ? (
            <Tag className="group-hover:border-white group-hover:text-white">
              Current
            </Tag>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-wider text-[var(--muted)] group-hover:text-zinc-400">
          {experience.techStack.slice(0, 4).map((tech) => (
            <span key={tech}>+ {tech}</span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-current pt-3 font-mono text-xs font-bold uppercase tracking-wider">
          <span>Open experience</span>
          <span className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      </Link>
    </article>
  );
}
