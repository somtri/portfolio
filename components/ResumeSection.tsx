import type { ResumeSection as ResumeSectionType } from "@/types/resume";
import { Tag } from "@/components/ui/Tag";

type ResumeSectionProps = {
  section: ResumeSectionType;
  index: number;
};

export function ResumeSection({ section, index }: ResumeSectionProps) {
  return (
    <section className="rule-strong py-8 pt-4">
      <div className="grid gap-6 md:grid-cols-[11rem_1fr]">
        <div>
          <span className="label row-muted">
            {String(index).padStart(2, "0")}
          </span>
          <h2 className="label mt-2">{section.title}</h2>
        </div>
        <div className="space-y-7">
          {section.items.map((item) => (
            <article key={`${item.heading}-${item.meta}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{item.heading}</h3>
                {item.placeholder ? <Tag>Placeholder</Tag> : null}
              </div>
              <p className="label row-muted mt-1">{item.meta}</p>
              <ul className="mt-4">
                {item.details.map((detail) => (
                  <li
                    key={detail}
                    className="rule row-muted grid grid-cols-[auto_1fr] gap-3 py-3 leading-7"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 bg-[var(--ink)]"
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
