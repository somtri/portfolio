export const projectCategories = [
  "AI/ML",
  "Quant/Finance",
  "Research Software",
  "Computer Vision",
  "Full-stack",
  "Systems/Tools",
  "Data Science",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  slug: string;
  title: string;
  oneLine: string;
  category: ProjectCategory;
  featured: boolean;
  placeholder: boolean;
  year?: string;
  overview: string;
  problem: string;
  built: string[];
  results?: string[];
  technicalFocus: string;
  techStack: string[];
  links: {
    github: string;
  };
};
