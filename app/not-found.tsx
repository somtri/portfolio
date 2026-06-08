import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="site-container page-section">
      <div className="border border-black bg-[var(--surface)] p-8 shadow-[8px_8px_0_var(--shadow)] sm:p-12">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          [404 / index miss]
        </p>
        <h1 className="mt-6 font-mono text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
          Entry not found.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted)]">
          This project or page is not part of the current portfolio index.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/projects">Project index</Button>
          <Button href="/" variant="outline">
            Home
          </Button>
        </div>
      </div>
    </section>
  );
}
