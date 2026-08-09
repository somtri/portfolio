import { projects } from "@/data/projects";
import { IndexRow } from "@/components/IndexRow";

type ProjectIndexProps = {
  limit?: number;
  startNum?: number;
};

export function ProjectIndex({ limit, startNum = 1 }: ProjectIndexProps) {
  const visible =
    typeof limit === "number" ? projects.slice(0, limit) : projects;

  return (
    <div className="rule-strong">
      {visible.map((project, index) => {
        const position = startNum + index;

        return (
          <IndexRow
            key={project.slug}
            href={`/projects/${project.slug}`}
            num={String(position).padStart(2, "0")}
            title={project.title}
            sub={project.oneLine}
            meta={project.category}
            year={project.year ?? ""}
            delayMs={Math.min(index * 35, 350)}
          />
        );
      })}
    </div>
  );
}
