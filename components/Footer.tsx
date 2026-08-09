import Link from "next/link";

export function Footer() {
  return (
    <footer className="rule pb-24 pt-16 sm:py-20">
      <div className="site-container sm:pr-18">
        <p className="text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">$</span> contact --open
        </p>
        <Link
          href="/contact"
          className="font-display mt-6 inline-block border border-[var(--ink)] px-8 py-4 text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl"
        >
          connect
        </Link>
        <div className="mt-12 flex flex-wrap justify-between gap-x-8 gap-y-2 text-xs text-[var(--faint)]">
          <span>[ somtripathi.dev &middot; next.js &middot; static + one api route ]</span>
          <span>[ answers cite their sources &middot; 42.026&deg;n 93.646&deg;w ]</span>
        </div>
      </div>
    </footer>
  );
}
