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
      <header className="pt-16 pb-10 sm:pt-24">
        <div className="flex flex-col gap-2 text-[11px] text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between sm:text-[11.5px]">
          <span>
            [ {project.category}
            {project.year ? ` · ${project.year}` : ""} ]
          </span>
        </div>

        <p className="mt-10 text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]" aria-hidden="true">
            $
          </span>{" "}
          cat ./projects/{project.slug}
        </p>

        <h1 className="mt-5 text-[28px] leading-tight font-bold text-[var(--ink)] sm:text-[34px]">
          {project.title}
        </h1>

        <p className="mt-4 max-w-3xl text-[14.5px] leading-7 text-[var(--muted)]">
          {project.oneLine}
        </p>
      </header>

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1fr_15rem]">
        <div>
          <TextSection index="01" title="overview">
            {project.overview}
          </TextSection>
          <TextSection index="02" title="problem">
            {project.problem}
          </TextSection>

          <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
            <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
              <span className="text-[var(--accent)]">[03]</span> what i built
            </p>
            <ul className="mt-4">
              {project.built.map((item) => (
                <li
                  key={item}
                  className="border-t border-[var(--line)] py-3.5 text-[14.5px] leading-7 text-[var(--muted)] last:border-b"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {project.results?.length ? (
            <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
              <div className="border border-[var(--line-strong)] bg-[var(--surface)] p-6 sm:p-8">
                <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                  <span className="text-[var(--accent)]">
                    [{String(resultsIndex).padStart(2, "0")}]
                  </span>{" "}
                  key results
                </p>
                <ul className="mt-4">
                  {project.results.map((result) => (
                    <li
                      key={result}
                      className="border-t border-[var(--line)] py-3.5 text-[14.5px] leading-7 text-[var(--muted)] first:border-t-0"
                    >
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <TextSection
            index={String(focusIndex).padStart(2, "0")}
            title="technical focus"
          >
            {project.technicalFocus}
          </TextSection>

          <section className="mt-12 border-t border-[var(--line)] pt-5 first:mt-0">
            <p className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
              <span className="text-[var(--accent)]">
                [{String(stackIndex).padStart(2, "0")}]
              </span>{" "}
              tech stack
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
            <div className="border-t border-[var(--line)] pt-3 [&:not(:first-child)]:mt-3">
              <dt className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                category
              </dt>
              <dd className="mt-1 text-sm text-[var(--muted)]">
                {project.category}
              </dd>
            </div>
            {project.year ? (
              <div className="border-t border-[var(--line)] pt-3 [&:not(:first-child)]:mt-3">
                <dt className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
                  year
                </dt>
                <dd className="mt-1 text-sm text-[var(--muted)]">
                  {project.year}
                </dd>
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

      <div className="mt-12 flex flex-wrap gap-3 border-t border-[var(--line)] pt-6">
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
