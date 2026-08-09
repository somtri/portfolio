import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "quiet";
  className?: string;
  download?: boolean;
};

export function Button({
  href,
  children,
  variant = "solid",
  className,
  download,
}: ButtonProps) {
  const styles = cn(
    "button-link inline-flex min-h-11 items-center justify-center gap-2 border px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.1em] transition duration-150",
    variant === "solid" && "button-link--solid",
    variant === "outline" && "button-link--outline",
    variant === "quiet" && "button-link--quiet px-2",
    className,
  );

  const isExternal = href.startsWith("http");

  if (isExternal || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={styles}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        download={download}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles} download={download}>
      {children}
    </Link>
  );
}
