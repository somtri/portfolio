import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExperienceDetail } from "@/components/ExperienceDetail";
import { experiences } from "@/data/experience";
import { getExperienceById } from "@/lib/experience";

type ExperiencePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return experiences.map((experience) => ({ id: experience.id }));
}

export async function generateMetadata({
  params,
}: ExperiencePageProps): Promise<Metadata> {
  const { id } = await params;
  const experience = getExperienceById(id);

  if (!experience) {
    return { title: "Experience not found" };
  }

  return {
    title: experience.title,
    description: experience.summary,
  };
}

export default async function ExperiencePage({
  params,
}: ExperiencePageProps) {
  const { id } = await params;
  const experience = getExperienceById(id);

  if (!experience) {
    notFound();
  }

  return (
    <div className="pt-12 sm:pt-16">
      <ExperienceDetail experience={experience} />
    </div>
  );
}
