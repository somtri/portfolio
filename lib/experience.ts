import type { Experience } from "../types/experience";
import { experiences } from "../data/experience";

export function getExperienceById(id: string): Experience | undefined {
  return experiences.find((experience) => experience.id === id);
}

export function sortExperiences(items: Experience[]): Experience[] {
  return [...items].sort((a, b) => {
    const aDate = a.current ? "9999-12" : (a.endDate ?? a.startDate);
    const bDate = b.current ? "9999-12" : (b.endDate ?? b.startDate);
    return bDate.localeCompare(aDate);
  });
}

export function formatExperienceDate(date: string): string {
  const [year, month] = date.split("-");
  if (!month) {
    return year;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
}
