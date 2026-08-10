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
        command="cat ./resume"
        summary="A structured web version of my education, research experience, selected projects, and core technical skills."
      />
      <section className="site-container pb-24">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="group flex items-baseline justify-between gap-4 border-t border-b border-[var(--line)] px-1 py-5 text-sm hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)]"
        >
          <span className="font-bold text-[var(--accent)] group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)]">
            open the official resume pdf
          </span>
          <span className="text-[11px] text-[var(--faint)]">pdf ↗</span>
        </a>
        <div className="mt-12">
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
