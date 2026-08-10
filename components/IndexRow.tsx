import Link from "next/link";

type IndexRowProps = {
  href: string;
  num: string;
  title: string;
  sub?: string;
  meta?: string;
  year?: string;
  delayMs?: number;
};

export function IndexRow({
  href,
  num,
  title,
  sub,
  meta,
  year,
  delayMs,
}: IndexRowProps) {
  return (
    <Link
      href={href}
      data-reveal
      style={{ transitionDelay: `${delayMs ?? 0}ms` }}
      className="group grid grid-cols-1 gap-2 border-t border-[var(--line)] px-1 py-5 text-sm last:border-b hover:bg-[var(--surface)] focus-visible:bg-[var(--surface)] sm:grid-cols-[3rem_200px_1fr_150px_60px] sm:items-baseline sm:gap-7"
    >
      <span className="text-[11px] text-[var(--faint)]">{num}</span>
      <span className="font-bold text-[var(--accent)] group-hover:text-[var(--ink)] group-focus-visible:text-[var(--ink)]">
        {title}
      </span>
      {sub ? (
        <span className="text-[13.5px] text-[var(--muted)]">{sub}</span>
      ) : (
        <span />
      )}
      {meta ? (
        <span className="text-[11px] tracking-[0.04em] text-[var(--faint)]">{meta}</span>
      ) : (
        <span />
      )}
      <span className="text-[12px] text-[var(--faint)] sm:text-right">{year ?? ""}</span>
    </Link>
  );
}
