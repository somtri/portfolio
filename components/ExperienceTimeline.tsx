import { experiences } from "@/data/experience";
import { sortExperiences } from "@/lib/experience";
import { ExperienceCard } from "@/components/ExperienceCard";

type ExperienceTimelineProps = {
  limit?: number;
};

export function ExperienceTimeline({ limit }: ExperienceTimelineProps) {
  const sorted = sortExperiences(experiences);
  const visible = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  return (
    <div className="relative grid gap-5 md:ml-10">
      <div
        aria-hidden="true"
        className="absolute -left-[2.2rem] top-0 hidden h-full w-px bg-black md:block"
      />
      {visible.map((experience, index) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          index={index + 1}
        />
      ))}
    </div>
  );
}
