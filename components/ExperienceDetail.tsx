import type { Experience } from "@/types/experience";
import { formatExperienceDate } from "@/lib/experience";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

type ExperienceDetailProps = {
  experience: Experience;
};

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
  const end = experience.current
    ? "Present"
    : experience.endDate
      ? formatExperienceDate(experience.endDate)
      : "";

  const hasPipeline = Boolean(experience.pipeline?.length);
  const workedIndex = hasPipeline ? 4 : 3;
  const toolsIndex = workedIndex + 1;

  return (
    <article className="site-container pb-20">
      <header className="pt-16 pb-10 sm:pt-24">
        <div className="flex flex-col gap-2 text-[11px] text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between sm:text-[11.5px]">
          <span>
            [ {experience.category}
            {experience.current ? " · current" : ""} ]
          </span>
        </div>

        <p className="mt-10 text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]" aria-hidden="true">
            $
          </span>{" "}
          cat ./experience/{experience.id}
        </p>

        <h1 className="mt-5 text-[28px] leading-tight font-bold text-[var(--ink)] sm:text-[34px]">
          {experience.title}
        </h1>

        <p className="mt-4 max-w-3xl text-[14.5px] leading-7 text-[var(--muted)]">
          {experience.summary}
        </p>
      </header>

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_15rem]">
        <div>
          <TextSection index="01" title="overview">
            {experience.overview}
          </TextSection>
          <TextSection index="02" title="technical focus">
            {experience.technicalFocus}
          </TextSection>

          {hasPipeline ? (
            <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
              <div className="border border-[var(--line-strong)] bg-[var(--surface)] p-6 sm:p-8">
                <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                  <span className="text-[var(--accent)]">[03]</span> pipeline
                </p>
                <ol className="mt-4 grid gap-0 md:grid-cols-3">
                  {experience.pipeline!.map((step, index) => (
                    <li
                      key={step}
                      className="flex items-start justify-between gap-3 border-t border-[var(--line)] py-3 pr-4 font-mono text-xs font-medium leading-5 tracking-[0.04em] md:border-t-0 md:border-l md:pl-4 md:first:border-l-0"
                    >
                      <span>{step}</span>
                      <span className="text-[var(--accent)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ) : null}

          <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
            <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
              <span className="text-[var(--accent)]">
                [{String(workedIndex).padStart(2, "0")}]
              </span>{" "}
              what i worked on
            </p>
            <ul className="mt-4">
              {experience.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="border-t border-[var(--line)] py-3.5 text-[14.5px] leading-7 text-[var(--muted)] last:border-b"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
            <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
              <span className="text-[var(--accent)]">
                [{String(toolsIndex).padStart(2, "0")}]
              </span>{" "}
              tools and topics
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {experience.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </section>
        </div>

        <aside className="self-start lg:sticky lg:top-24">
          <dl>
            <div className="border-t border-[var(--line)] pt-3 [&:not(:first-child)]:mt-3">
              <dt className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                role
              </dt>
              <dd className="mt-1 text-sm text-[var(--muted)]">
                {experience.role}
              </dd>
            </div>
            <div className="border-t border-[var(--line)] pt-3 [&:not(:first-child)]:mt-3">
              <dt className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                organization
              </dt>
              <dd className="mt-1 text-sm text-[var(--muted)]">
                {experience.organization}
              </dd>
            </div>
            <div className="border-t border-[var(--line)] pt-3 [&:not(:first-child)]:mt-3">
              <dt className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                dates
              </dt>
              <dd className="mt-1 text-sm text-[var(--muted)]">
                {formatExperienceDate(experience.startDate)} - {end}
              </dd>
            </div>
            {experience.location ? (
              <div className="border-t border-[var(--line)] pt-3 [&:not(:first-child)]:mt-3">
                <dt className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                  location
                </dt>
                <dd className="mt-1 text-sm text-[var(--muted)]">
                  {experience.location}
                </dd>
              </div>
            ) : null}
          </dl>
          {experience.links?.github ? (
            <div className="mt-6">
              <Button href={experience.links.github} className="w-full">
                GitHub
              </Button>
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-[var(--line)] pt-6">
        {experience.links?.github ? (
          <Button href={experience.links.github}>GitHub</Button>
        ) : null}
        <Button href="/experience" variant="outline">
          Back to experience
        </Button>
      </div>
    </article>
  );
}

function TextSection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: string;
}) {
  return (
    <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
      <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
        <span className="text-[var(--accent)]">[{index}]</span> {title}
      </p>
      <p className="mt-4 max-w-4xl text-[14.5px] leading-7 text-[var(--muted)]">
        {children}
      </p>
    </section>
  );
}
