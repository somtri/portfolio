import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="site-footer border-t border-zinc-700 py-5">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="font-mono text-xs font-bold tracking-[0.16em] text-zinc-400">
          {profile.name} · {profile.location} · {profile.university}
        </p>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-zinc-400"
        >
          <Link href="/projects" className="site-footer-link">
            Projects
          </Link>
          <Link href="/experience" className="site-footer-link">
            Experience
          </Link>
          <Link href="/resume" className="site-footer-link">
            Resume
          </Link>
          <Link href="/contact" className="site-footer-link">
            Contact
          </Link>
          <a
            href={profile.links.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="site-footer-link"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.github.href}
            target="_blank"
            rel="noreferrer"
            className="site-footer-link"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
