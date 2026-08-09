import { profile } from "@/data/profile";

const items = [
  {
    key: "Email",
    label: profile.links.email.label,
    href: profile.links.email.href,
    note: "Direct contact",
    placeholder: false,
  },
  {
    key: "LinkedIn",
    label: profile.links.linkedin.label,
    href: profile.links.linkedin.href,
    note: "Professional profile",
    placeholder: false,
  },
  {
    key: "GitHub",
    label: profile.links.github.label,
    href: profile.links.github.href,
    note: "Code and repositories",
    placeholder: false,
  },
  {
    key: "Resume",
    label: profile.links.resume.label,
    href: profile.links.resume.href,
    note: "PDF download",
    placeholder: false,
  },
  {
    key: "Location",
    label: `${profile.location} · ${profile.university}`,
    note: "Current base",
    placeholder: true,
  },
];

export function ContactLinks() {
  return (
    <div className="grid border-l border-t border-[var(--line)] md:grid-cols-2">
      {items.map((item, index) => {
        const content = (
          <>
            <div className="label flex items-center justify-between">
              <span>{item.key}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-8 text-lg font-semibold">{item.label}</p>
            <p className="row-muted group-hover:text-[var(--panel-muted)] mt-2 text-sm">
              {item.note}
            </p>
            <div className="label rule mt-6 flex items-center justify-between pt-3">
              <span>
                {item.key === "Location"
                  ? "Ames, Iowa"
                  : item.placeholder
                    ? "Pending"
                    : "Open"}
              </span>
              {!item.placeholder ? <span aria-hidden="true">↗</span> : null}
            </div>
          </>
        );

        if (!item.href || item.placeholder) {
          return (
            <div
              key={item.key}
              className="group border-b border-r border-[var(--line)] bg-[var(--surface)] p-6"
            >
              {content}
            </div>
          );
        }

        const external = item.href.startsWith("http");

        return (
          <a
            key={item.key}
            href={item.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="group border-b border-r border-[var(--line)] bg-[var(--surface)] p-6 hover:bg-[var(--panel-bg)] hover:text-[var(--panel-text)]"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
