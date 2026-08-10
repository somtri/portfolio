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
      <div data-reveal>
        <p className="label row-muted">
          [ {experience.category}
          {experience.current ? " / Current" : ""} ]
        </p>
        <h1 className="page-title text-balance mt-4">{experience.title}</h1>
        <p className="text-pretty row-muted mt-5 max-w-3xl text-xl leading-8">
          {experience.summary}
        </p>
        <div className="rule-strong mt-8" />
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_15rem]">
        <div>
          <TextSection index="01" title="Overview">
            {experience.overview}
          </TextSection>
          <TextSection index="02" title="Technical focus" className="mt-10">
            {experience.technicalFocus}
          </TextSection>

          {hasPipeline ? (
            <div className="ink-panel mt-10 p-6 sm:p-8">
              <p className="label text-[var(--panel-muted)]">
                <span className="text-[var(--accent-panel)]">03</span> /
                Pipeline
              </p>
              <ol className="mt-4 grid gap-0 md:grid-cols-3">
                {experience.pipeline!.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start justify-between gap-3 border-t border-[var(--panel-line)] py-3 pr-4 font-mono text-xs font-medium leading-5 tracking-[0.04em] md:border-t-0 md:border-l md:pl-4 md:first:border-l-0"
                  >
                    <span>{step}</span>
                    <span className="text-[var(--accent-panel)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <section className="rule-strong mt-10 pt-4">
            <p className="label row-muted">
              <span className="text-[var(--accent)]">
                {String(workedIndex).padStart(2, "0")}
              </span>{" "}
              / What I worked on
            </p>
            <ul className="mt-4">
              {experience.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="rule grid grid-cols-[auto_1fr] gap-3 py-3 leading-7"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 bg-[var(--ink)]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rule-strong mt-10 pt-4">
            <p className="label row-muted">
              <span className="text-[var(--accent)]">
                {String(toolsIndex).padStart(2, "0")}
              </span>{" "}
              / Tools and topics
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
            <div className="rule pt-3 [&:not(:first-child)]:mt-3">
              <dt className="label row-muted">Role</dt>
              <dd className="mt-1 text-sm leading-6">{experience.role}</dd>
            </div>
            <div className="rule pt-3 [&:not(:first-child)]:mt-3">
              <dt className="label row-muted">Organization</dt>
              <dd className="mt-1 text-sm leading-6">
                {experience.organization}
              </dd>
            </div>
            <div className="rule pt-3 [&:not(:first-child)]:mt-3">
              <dt className="label row-muted">Dates</dt>
              <dd className="mt-1 text-sm leading-6">
                {formatExperienceDate(experience.startDate)} - {end}
              </dd>
            </div>
            {experience.location ? (
              <div className="rule pt-3 [&:not(:first-child)]:mt-3">
                <dt className="label row-muted">Location</dt>
                <dd className="mt-1 text-sm leading-6">
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

      <div className="rule-strong mt-12 flex flex-wrap gap-3 pt-6">
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
  className,
  children,
}: {
  index: string;
  title: string;
  className?: string;
  children: string;
}) {
  return (
    <section className={`rule-strong pt-4 ${className ?? ""}`}>
      <p className="label row-muted">
        <span className="text-[var(--accent)]">{index}</span> / {title}
      </p>
      <p className="text-pretty mt-4 max-w-4xl text-lg leading-8">
        {children}
      </p>
    </section>
  );
}
