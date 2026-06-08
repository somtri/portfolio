import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ResumeSection } from "@/components/ResumeSection";
import { resumeSections } from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "A structured web resume and downloadable PDF entry point.",
};

export default function ResumePage() {
  return (
    <>
      <PageHeader
        title="The concise version of the work."
        summary="A structured web version of my education, research experience, selected projects, and core technical skills."
      />
      <section className="site-container pb-20">
        <div className="border border-black bg-black p-5 text-white">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 font-mono text-xs font-bold uppercase tracking-wider underline-offset-4 hover:underline"
          >
            <span>Open the official resume PDF</span>
            <span>↗</span>
          </a>
        </div>
        <div className="mt-8 border-b border-black">
          {resumeSections.map((section, index) => (
            <ResumeSection
              key={section.title}
              section={section}
              index={index + 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
