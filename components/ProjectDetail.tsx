import type { Project } from "@/types/project";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

type ProjectDetailProps = {
  project: Project;
};

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article className="site-container pb-20">
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div className="border border-black bg-[var(--surface)] p-6 sm:p-10">
          <h1 className="text-balance font-mono text-4xl font-black uppercase leading-[0.95] tracking-[-0.055em] sm:text-6xl">
            {project.title}
          </h1>
          <p className="text-pretty mt-6 max-w-3xl text-xl leading-8 text-[var(--muted)]">
            {project.oneLine}
          </p>
        </div>

        <aside className="flex flex-col border border-black bg-black p-6 text-white">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Project index
          </p>
          <dl className="mt-6 space-y-5">
            <MetaItem label="Category" value={project.category} />
            {project.year ? <MetaItem label="Year" value={project.year} /> : null}
          </dl>
          <div className="mt-auto pt-8">
            <Button href={project.links.github} className="w-full">
              GitHub
            </Button>
          </div>
        </aside>
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <TextSection index="01" title="Overview">
          {project.overview}
        </TextSection>
        <TextSection index="02" title="Problem">
          {project.problem}
        </TextSection>
      </div>

      <section className="mt-12 border-t border-black pt-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          03 / What I built
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {project.built.map((item) => (
            <li
              key={item}
              className="grid grid-cols-[auto_1fr] gap-3 border border-black bg-[var(--surface)] p-5 leading-7"
            >
              <span aria-hidden="true" className="mt-2.5 h-2 w-2 bg-black" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {project.results?.length ? (
        <section className="mt-12 border border-black bg-black p-6 text-white sm:p-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
            04 / Key results
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {project.results.map((result) => (
              <li
                key={result}
                className="grid grid-cols-[auto_1fr] gap-3 border border-zinc-600 p-5 leading-7"
              >
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-2 w-2 bg-white"
                />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 border-t border-black pt-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          {project.results?.length ? "05" : "04"} / Technical focus
        </p>
        <p className="text-pretty mt-4 max-w-4xl text-lg leading-8">
          {project.technicalFocus}
        </p>
      </section>

      <section className="mt-12 border border-black bg-[var(--surface)] p-6 sm:p-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
          {project.results?.length ? "06" : "05"} / Tech stack
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-black pt-6">
        <Button href={project.links.github}>GitHub</Button>
        <Button href="/projects" variant="outline">
          Back to projects
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
