import { skillGroups } from "@/data/skills";

export function SkillMatrix() {
  return (
    <div className="grid border-l border-t border-black sm:grid-cols-2 lg:grid-cols-4">
      {skillGroups.map((group, index) => (
        <section
          key={group.label}
          className="border-b border-r border-black bg-[var(--surface)] p-5"
        >
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider">
            <h3>{group.label}</h3>
            <span className="text-[var(--muted)]">0{index + 1}</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
            {group.items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-black" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
