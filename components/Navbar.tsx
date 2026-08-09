"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", index: "0", label: "index" },
  { href: "/projects", index: "1", label: "work" },
  { href: "/experience", index: "2", label: "experience" },
  { href: "/resume", index: "3", label: "resume" },
  { href: "/contact", index: "4", label: "contact" },
  { href: "/ask", index: "?", label: "ask" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]">
      <div className="site-container flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] py-4 text-xs text-[var(--muted)]">
        <span>
          <span className="font-bold text-[var(--ink)]">som@portfolio</span>
          : ~
        </span>
        <span className="flex flex-wrap items-center gap-5">
          <span className="text-[var(--faint)]">
            [ 42.026&deg;n 93.646&deg;w &middot; ames, ia ]
          </span>
          <ThemeToggle />
        </span>
      </div>
      <nav
        aria-label="Main navigation"
        className="site-container flex flex-wrap gap-x-7 gap-y-2 border-b border-[var(--line)] py-4 text-xs text-[var(--muted)]"
      >
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2",
                active && "text-[var(--ink)]",
              )}
            >
              <span className="font-bold text-[var(--accent)]">
                [{item.index}]
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
