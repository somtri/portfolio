import type { ResumeSection as ResumeSectionType } from "@/types/resume";
import { Tag } from "@/components/ui/Tag";

type ResumeSectionProps = {
  section: ResumeSectionType;
  index: number;
};

export function ResumeSection({ section, index }: ResumeSectionProps) {
  return (
    <section className="border-t border-[var(--line)] pt-5 mt-12 first:mt-0">
      {/* A heading, not a styled paragraph: the resume is the one page whose
          sections a screen-reader user navigates by outline. It looks
          identical to the detail pages' markers. */}
      <h2 className="text-[11px] font-normal tracking-[0.04em] text-[var(--faint)]">
        <span className="text-[var(--accent)]">
          [{String(index).padStart(2, "0")}]
        </span>{" "}
        {section.title}
      </h2>
      <div className="mt-4">
        {section.items.map((item) => (
          <article
            key={`${item.heading}-${item.meta}`}
            className="mt-8 first:mt-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-bold text-[var(--ink)]">{item.heading}</h3>
              {item.placeholder ? <Tag>placeholder</Tag> : null}
            </div>
            <p className="mt-1 text-[11px] tracking-[0.04em] text-[var(--faint)]">
              {item.meta}
            </p>
            <ul className="mt-4">
              {item.details.map((detail) => (
                <li
                  key={detail}
                  className="border-t border-[var(--line)] py-3.5 text-[14.5px] leading-7 text-[var(--muted)] last:border-b"
                >
                  {detail}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
