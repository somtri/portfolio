import Link from "next/link";
import { AskRepl } from "@/components/AskRepl";
import { Fortune } from "@/components/Fortune";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { formatExperienceDate, sortExperiences } from "@/lib/experience";
import { getFortuneTail } from "@/lib/fortune";

export const revalidate = 604800;

export default async function Home() {
  const tail = await getFortuneTail();
  const sortedExperiences = sortExperiences(experiences);
  const currentExperience =
    sortedExperiences.find((experience) => experience.current) ??
    sortedExperiences[0];
  const orgMatch = currentExperience.organization.match(/\(([^)]+)\)/);
  const orgShort = orgMatch ? orgMatch[1] : currentExperience.organization;
  const nowText = `${currentExperience.role} @ ${orgShort}`;
  const roleText = `${profile.title.split(" / ")[0]}, ${profile.university}`;
  const focusText = profile.focusAreas.join(" · ");

  return (
    <>
      <header className="site-container pt-16 pb-20 sm:pt-28 sm:pb-24">
        <div className="flex flex-col gap-2 text-[11px] text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between sm:text-[11.5px]">
          <span>[ 42.026°n 93.646°w ]</span>
          <span className="text-[var(--accent)]">[ now: {nowText} ]</span>
          <span>[ est. 2005 · idx 001 ]</span>
        </div>

        <p className="mt-10 text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span> whoami
        </p>

        <h1 className="hero-wordmark my-4">
          som{" "}
          <span className="whitespace-nowrap">
            tripathi
            <span className="hero-cursor" aria-hidden="true" />
          </span>
        </h1>

        <div className="grid gap-2.5 text-[14.5px] text-[var(--muted)]">
          <p>
            <span className="text-[var(--faint)]">role </span>
            <span className="font-bold text-[var(--ink)]">{roleText}</span>
          </p>
          <p>
            <span className="text-[var(--faint)]">focus </span>
            <span className="font-bold text-[var(--ink)]">{focusText}</span>
          </p>
          <p>
            <span className="text-[var(--faint)]">now </span>
            <span className="font-bold text-[var(--ink)]">{nowText}</span>
          </p>
        </div>
      </header>

      <section className="site-container pt-16 pb-4 sm:pt-24">
        <p className="text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span> ls ./projects
        </p>
        <div className="mt-9">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group grid grid-cols-1 gap-2 border-t border-[var(--line)] px-1 py-5 text-sm last:border-b hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)] sm:grid-cols-[190px_1fr_130px_60px] sm:items-baseline sm:gap-7"
            >
              <span className="font-bold text-[var(--accent)] group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)]">
                {project.title}
              </span>
              <span className="text-[13.5px] text-[var(--muted)]">
                {project.oneLine}
              </span>
              <span className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                {project.category}
              </span>
              <span className="text-[12px] text-[var(--faint)] sm:text-right">
                {project.year ?? ""}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-container pt-16 pb-4 sm:pt-24">
        <p className="text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span> cat ./experience
        </p>
        <div className="mt-9">
          {sortedExperiences.map((experience) => (
            <Link
              key={experience.id}
              href={`/experience/${experience.id}`}
              className="grid grid-cols-1 gap-2 border-t border-[var(--line)] px-1 py-5 text-sm last:border-b hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)] sm:grid-cols-[1fr_190px] sm:items-start sm:gap-7"
            >
              <span>
                <span className="block font-bold text-[var(--ink)]">
                  {experience.organization}
                </span>
                <span className="mt-1 block text-[13.5px] text-[var(--muted)]">
                  {experience.role}
                </span>
              </span>
              <span className="text-[12px] text-[var(--faint)] sm:text-right">
                {formatExperienceDate(experience.startDate)} →{" "}
                {experience.current ? (
                  <span className="text-[var(--live)]">live</span>
                ) : (
                  formatExperienceDate(experience.endDate!)
                )}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-container pt-16 pb-4 sm:pt-24">
        <p className="text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span> fortune{" "}
          <span className="text-[var(--faint)]">
            [ rotates weekly · sourced from the week&apos;s ai/ml/quant news ]
          </span>
        </p>
        <Fortune tail={tail} />
      </section>

      <section className="site-container pt-16 pb-20 sm:pt-24 sm:pb-28">
        <p className="text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span> som --ask
        </p>
        <div className="mt-9">
          <AskRepl />
        </div>
      </section>
    </>
  );
}
