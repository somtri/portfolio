import type { Project } from "@/types/project";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";

type ProjectDetailProps = {
  project: Project;
};

export function ProjectDetail({ project }: ProjectDetailProps) {
  const resultsIndex = project.results?.length ? 4 : null;
  const focusIndex = resultsIndex ? 5 : 4;
  const stackIndex = focusIndex + 1;

  return (
    <article className="site-container pb-20">
      <div data-reveal>
        <p className="label row-muted">
          [ {project.category}
          {project.year ? ` / ${project.year}` : ""} ]
        </p>
        <h1 className="page-title text-balance mt-4">{project.title}</h1>
        <p className="text-pretty row-muted mt-5 max-w-3xl text-xl leading-8">
          {project.oneLine}
        </p>
        <div className="rule-strong mt-8" />
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_15rem]">
        <div>
          <TextSection index="01" title="Overview">
            {project.overview}
          </TextSection>
          <TextSection index="02" title="Problem" className="mt-10">
            {project.problem}
          </TextSection>

          <section className="rule-strong mt-10 pt-4">
            <p className="label row-muted">
              <span className="text-[var(--accent)]">03</span> / What I built
            </p>
            <ul className="mt-4">
              {project.built.map((item) => (
                <li
                  key={item}
                  className="rule grid grid-cols-[auto_1fr] gap-3 py-3 leading-7"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 bg-[var(--ink)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {project.results?.length ? (
            <div className="ink-panel mt-10 p-6 sm:p-8">
              <p className="label text-[var(--panel-muted)]">
                <span className="text-[var(--accent-panel)]">
                  {String(resultsIndex).padStart(2, "0")}
                </span>{" "}
                / Key results
              </p>
              <ul className="mt-4">
                {project.results.map((result, index) => (
                  <li
                    key={result}
                    className={`grid grid-cols-[auto_1fr] gap-3 border-[var(--panel-line)] py-3 leading-7 ${
                      index === 0 ? "border-t-0" : "border-t"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 bg-[var(--panel-text)]"
                    />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <TextSection
            index={String(focusIndex).padStart(2, "0")}
            title="Technical focus"
            className="mt-10"
          >
            {project.technicalFocus}
          </TextSection>

          <section className="rule-strong mt-10 pt-4">
            <p className="label row-muted">
              <span className="text-[var(--accent)]">
                {String(stackIndex).padStart(2, "0")}
              </span>{" "}
              / Tech stack
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </section>
        </div>

        <aside className="self-start lg:sticky lg:top-24">
          <dl>
            <div className="rule pt-3 [&:not(:first-child)]:mt-3">
              <dt className="label row-muted">Category</dt>
              <dd className="mt-1 text-sm leading-6">{project.category}</dd>
            </div>
            {project.year ? (
              <div className="rule pt-3 [&:not(:first-child)]:mt-3">
                <dt className="label row-muted">Year</dt>
                <dd className="mt-1 text-sm leading-6">{project.year}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-6">
            <Button href={project.links.github} className="w-full">
              GitHub
            </Button>
          </div>
        </aside>
      </div>

      <div className="rule-strong mt-12 flex flex-wrap gap-3 pt-6">
        <Button href={project.links.github}>GitHub</Button>
        <Button href="/projects" variant="outline">
          Back to projects
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
