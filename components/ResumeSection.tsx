import type { ResumeSection as ResumeSectionType } from "@/types/resume";
import { Tag } from "@/components/ui/Tag";

type ResumeSectionProps = {
  section: ResumeSectionType;
  index: number;
};

export function ResumeSection({ section, index }: ResumeSectionProps) {
  return (
    <section className="border-t border-black py-8">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
        <div>
          <span className="font-mono text-xs text-[var(--muted)]">
            {String(index).padStart(2, "0")}
          </span>
          <h2 className="mt-2 font-mono text-sm font-black uppercase tracking-[0.12em]">
            {section.title}
          </h2>
        </div>
        <div className="space-y-7">
          {section.items.map((item) => (
            <article key={`${item.heading}-${item.meta}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-bold">{item.heading}</h3>
                {item.placeholder ? <Tag>Placeholder</Tag> : null}
              </div>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
                {item.meta}
              </p>
              <ul className="mt-4 space-y-2">
                {item.details.map((detail) => (
                  <li
                    key={detail}
                    className="grid grid-cols-[auto_1fr] gap-3 leading-7 text-[var(--muted)]"
                  >
                    <span aria-hidden="true" className="mt-2.5 h-2 w-2 bg-black" />
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
