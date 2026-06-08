export type ExperienceCategory =
  | "Research"
  | "Work"
  | "Teaching"
  | "Leadership"
  | "Coursework"
  | "Project";

export type Experience = {
  id: string;
  title: string;
  role: string;
  organization: string;
  category: ExperienceCategory;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  placeholder: boolean;
  summary: string;
  overview: string;
  bullets: string[];
  technicalFocus: string;
  pipeline?: string[];
  techStack: string[];
  links?: {
    github?: string;
  };
};
