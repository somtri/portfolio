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
    <div>
      {items.map((item, index) => {
        const nn = String(index + 1).padStart(2, "0");
        const href = item.placeholder ? undefined : item.href;
        const isLink = Boolean(href);
        const content = (
          <>
            <span className="text-[11px] text-[var(--faint)]">{nn}</span>
            <span className="text-[11px] tracking-[0.04em] text-[var(--faint)]">
              {item.key}
            </span>
            {/* The accent marks what is clickable. A row that is only a
                value - location - stays ink, so it never reads as a link
                that does nothing when clicked. */}
            <span
              className={
                isLink
                  ? "font-bold text-[var(--accent)] group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)]"
                  : "font-bold text-[var(--ink)]"
              }
            >
              {item.label}
            </span>
            <span className="text-[11px] text-[var(--faint)] sm:text-right">
              {item.note}
            </span>
          </>
        );

        if (!href) {
          return (
            <div
              key={item.key}
              className="grid grid-cols-1 gap-2 border-t border-[var(--line)] px-1 py-5 text-sm last:border-b sm:grid-cols-[3rem_140px_1fr_auto] sm:items-baseline sm:gap-7"
            >
              {content}
            </div>
          );
        }

        const external = href.startsWith("http");

        return (
          <a
            key={item.key}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="group grid grid-cols-1 gap-2 border-t border-[var(--line)] px-1 py-5 text-sm last:border-b hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)] sm:grid-cols-[3rem_140px_1fr_auto] sm:items-baseline sm:gap-7"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
