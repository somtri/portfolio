import type { MetadataRoute } from "next";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

// /about is deliberately absent: it is a redirect to /, so listing it would
// point crawlers at a duplicate of the home page.
const STATIC_ROUTES = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.9 },
  { path: "/experience", priority: 0.9 },
  { path: "/resume", priority: 0.8 },
  { path: "/contact", priority: 0.6 },
  { path: "/ask", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...experiences.map((experience) => ({
      url: `${SITE_URL}/experience/${experience.id}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
