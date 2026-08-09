import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="ink-panel border-t border-[var(--panel-line)] pb-20 pt-5 sm:py-5">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="font-mono text-xs tracking-[0.16em] text-[var(--panel-muted)]">
          {profile.name} · {profile.location} · {profile.university}
        </p>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs tracking-[0.16em] text-[var(--panel-muted)]"
        >
          <Link href="/projects" className="footer-link">
            Projects
          </Link>
          <Link href="/experience" className="footer-link">
            Experience
          </Link>
          <Link href="/resume" className="footer-link">
            Resume
          </Link>
          <Link href="/contact" className="footer-link">
            Contact
          </Link>
          <Link href="/ask" className="footer-link">
            Ask
          </Link>
          <a
            href={profile.links.linkedin.href}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.github.href}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
