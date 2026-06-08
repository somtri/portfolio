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

  return (
    <article className="site-container pb-20">
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="border border-black bg-[var(--surface)] p-6 sm:p-10">
          <div className="flex flex-wrap gap-2">
            <Tag>{experience.category}</Tag>
            {experience.current ? <Tag>Current</Tag> : null}
          </div>
          <h1 className="text-balance mt-6 font-mono text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-6xl">
            {experience.title}
          </h1>
          <p className="text-pretty mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
            {experience.summary}
          </p>
        </div>

        <aside className="border border-black bg-black p-6 text-white">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Role index
          </p>
          <dl className="mt-6 space-y-5">
            <MetaItem label="Role" value={experience.role} />
            <MetaItem label="Organization" value={experience.organization} />
            <MetaItem
              label="Dates"
              value={`${formatExperienceDate(experience.startDate)} - ${end}`}
            />
            {experience.location ? (
              <MetaItem label="Location" value={experience.location} />
            ) : null}
          </dl>
        </aside>
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <TextSection index="01" title="Overview">
          {experience.overview}
        </TextSection>
        <TextSection index="02" title="Technical focus">
          {experience.technicalFocus}
        </TextSection>
      </div>

      {experience.pipeline?.length ? (
        <section className="mt-12 border border-black bg-black p-6 text-white sm:p-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            03 / Pipeline
          </p>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {experience.pipeline.map((step, index) => (
              <li
                key={step}
                className="flex min-h-24 items-start justify-between gap-4 border border-zinc-600 p-4 font-mono text-xs font-bold uppercase leading-5 tracking-wider"
              >
                <span>{step}</span>
                <span className="text-zinc-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-12 border-t border-black pt-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          {experience.pipeline?.length ? "04" : "03"} / What I worked on
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {experience.bullets.map((bullet) => (
            <li
              key={bullet}
              className="grid grid-cols-[auto_1fr] gap-3 border border-black bg-[var(--surface)] p-5 leading-7"
            >
              <span aria-hidden="true" className="mt-2.5 h-2 w-2 bg-black" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border border-black bg-[var(--surface)] p-6 sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          {experience.pipeline?.length ? "05" : "04"} / Tools and topics
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {experience.techStack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-black pt-6">
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

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-zinc-700 pb-4">
      <dt className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 text-sm leading-6">{value}</dd>
    </div>
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
    <section className="border-t border-black pt-5">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
        {index} / {title}
      </p>
      <p className="text-pretty mt-4 text-lg leading-8">{children}</p>
    </section>
  );
}
