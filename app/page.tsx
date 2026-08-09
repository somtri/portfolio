import Link from "next/link";
import { ExperienceIndex } from "@/components/ExperienceIndex";
import { ProjectIndex } from "@/components/ProjectIndex";
import { ReactiveHeadline } from "@/components/ReactiveHeadline";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <section
        className="site-container overflow-x-hidden pt-14 sm:pt-24"
        data-reveal
        data-headline-zone
      >
        <p className="label row-muted">Software / AI / Quant / Research</p>
        <h1 className="display-name mt-4" aria-label={profile.name}>
          <ReactiveHeadline name={profile.name} />
        </h1>
        <p className="label mt-6 max-w-3xl leading-5">{profile.title}</p>
        <p className="text-pretty row-muted mt-5 max-w-2xl text-lg leading-8">
          {profile.shortBio}
        </p>
        <div className="rule-strong mt-10" />
      </section>

      <section className="site-container pb-20 pt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="label">[ Index / Experience ]</h2>
          <Link
            href="/experience"
            className="label row-muted hover:text-[var(--ink)]"
          >
            All →
          </Link>
        </div>
        <div className="mt-3">
          <ExperienceIndex />
        </div>

        <div className="mt-14 flex items-baseline justify-between">
          <h2 className="label">[ Index / Projects ]</h2>
          <Link
            href="/projects"
            className="label row-muted hover:text-[var(--ink)]"
          >
            All →
          </Link>
        </div>
        <div className="mt-3">
          <ProjectIndex />
        </div>
      </section>
    </>
  );
}
