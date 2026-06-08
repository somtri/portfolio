import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software, applied AI, quantitative research, computer vision, and data-system projects.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Selected technical projects."
        summary="Software projects across real-time monitoring, financial machine learning, systems programming, static web architecture, predictive modeling, and economic forecasting."
      />
      <section className="site-container pb-20">
        <ProjectGrid projects={projects} />
      </section>
    </>
  );
}
