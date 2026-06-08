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
    <div className="grid border-l border-t border-black md:grid-cols-2">
      {items.map((item, index) => {
        const content = (
          <>
            <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider">
              <span>{item.key}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-8 text-lg font-semibold">{item.label}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.note}</p>
            <div className="mt-6 flex items-center justify-between border-t border-current pt-3 font-mono text-xs font-bold uppercase tracking-wider">
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
              className="border-b border-r border-black bg-[var(--surface)] p-6"
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
            className="border-b border-r border-black bg-[var(--surface)] p-6 transition hover:bg-black hover:text-white"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
