import { experiences } from "@/data/experience";
import { formatExperienceDate, sortExperiences } from "@/lib/experience";
import { IndexRow } from "@/components/IndexRow";

type ExperienceIndexProps = {
  limit?: number;
  startNum?: number;
  showSub?: boolean;
};

export function ExperienceIndex({
  limit,
  startNum = 1,
  showSub = true,
}: ExperienceIndexProps) {
  const sorted = sortExperiences(experiences);
  const visible = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  return (
    <div>
      {visible.map((experience, index) => {
        const position = startNum + index;
        const year = experience.startDate.split("-")[0];
        const meta = `${formatExperienceDate(experience.startDate)} – ${
          experience.current
            ? "Present"
            : formatExperienceDate(experience.endDate!)
        }`;

        return (
          <IndexRow
            key={experience.id}
            href={`/experience/${experience.id}`}
            num={String(position).padStart(2, "0")}
            title={experience.organization}
            sub={showSub ? experience.role : undefined}
            meta={meta}
            year={year}
            delayMs={Math.min(index * 35, 350)}
          />
        );
      })}
    </div>
  );
}
