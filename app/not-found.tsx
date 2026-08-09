import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="site-container page-section" data-reveal>
      <p className="label row-muted">[ 404 / Index miss ]</p>
      <h1 className="page-title mt-4">Entry not found.</h1>
      <p className="text-pretty row-muted mt-5 max-w-xl text-lg leading-8">
        This project or page is not part of the current portfolio index.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/projects">Project index</Button>
        <Button href="/" variant="outline">
          Home
        </Button>
      </div>
    </section>
  );
}
