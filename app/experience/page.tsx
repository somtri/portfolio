import type { Metadata } from "next";
import { ExperienceIndex } from "@/components/ExperienceIndex";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Research, teaching, technical work, and the methods used across each role.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        title="Research, engineering, and teaching in practice."
        summary="Select a role to explore the research context, methods, pipeline, tools, and concrete contributions behind the work."
      />
      <section className="site-container pb-20">
        <ExperienceIndex />
      </section>
    </>
  );
}
