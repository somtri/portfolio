"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black bg-[var(--nav-background)] backdrop-blur">
      <div className="site-container flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="group flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.16em]"
          aria-label="Som Tripathi home"
        >
          <span className="grid h-8 w-8 place-items-center border border-black bg-black text-white transition group-hover:bg-white group-hover:text-black">
            ST
          </span>
          <span className="hidden sm:inline">Som Tripathi</span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center justify-end gap-x-1 gap-y-2">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "nav-link",
                      active && "nav-link--active",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
