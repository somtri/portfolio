import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <section className="site-container page-section pt-12 sm:pt-20" data-reveal>
      <div className="grid border border-black bg-[var(--surface)] shadow-[8px_8px_0_var(--shadow)] lg:grid-cols-[1.35fr_0.65fr]">
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Software / AI / Quant / Research
          </p>
          <h1 className="mt-3 font-mono text-5xl font-black uppercase leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-7 max-w-3xl font-mono text-sm font-bold uppercase leading-6 tracking-[0.08em] sm:text-base">
            {profile.title}
          </p>
          <p className="text-pretty mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            {profile.shortBio}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/experience">Experience</Button>
            <Button href="/projects" variant="outline">
              Projects
            </Button>
            <Button href="/resume" variant="outline">
              Resume
            </Button>
            <Button href="/contact" variant="quiet">
              Contact
            </Button>
          </div>
        </div>

        <aside className="border-t border-black bg-black p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Current focus
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.focusAreas.map((area) => (
              <Tag key={area} className="border-white text-white">
                {area}
              </Tag>
            ))}
          </div>
          <p className="mt-8 border-t border-zinc-700 pt-6 font-mono text-xs uppercase leading-6 tracking-wider text-zinc-400">
            Building software that connects models, data, and usable systems.
          </p>
        </aside>
      </div>
    </section>
  );
}
