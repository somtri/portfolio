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
      className="index-row group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 px-2 py-4 md:grid-cols-[3.5rem_1fr_auto_4rem_1.5rem]"
    >
      <span className="label row-muted">{num}</span>
      <span>
        <span className="block font-mono text-base font-bold uppercase tracking-[-0.02em] sm:text-lg">
          {title}
        </span>
        {sub ? (
          <span className="row-muted mt-1 block max-w-2xl text-sm leading-6">
            {sub}
          </span>
        ) : null}
      </span>
      {meta ? (
        <span className="label row-muted hidden md:block">{meta}</span>
      ) : null}
      {year ? <span className="label">{year}</span> : null}
      <span aria-hidden="true" className="hidden text-sm md:block">
        →
      </span>
    </Link>
  );
}
