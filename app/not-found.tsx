import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="site-container pt-16 pb-24 sm:pt-24">
      <p className="text-[11px] text-[var(--faint)]">[ 404 ]</p>
      <p className="mt-10 text-sm text-[var(--muted)]">
        <span className="text-[var(--accent)]" aria-hidden="true">
          $
        </span>{" "}
        cat ./not-found
      </p>
      <h1 className="mt-5 text-[28px] leading-tight font-bold text-[var(--ink)] sm:text-[34px]">
        no such entry
      </h1>
      <p className="mt-4 max-w-2xl text-[14.5px] leading-7 text-[var(--muted)]">
        this project or page is not part of the current portfolio index.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button href="/projects">Project index</Button>
        <Button href="/" variant="outline">
          Home
        </Button>
      </div>
    </section>
  );
}
