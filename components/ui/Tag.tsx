import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TagProps = {
  children: ReactNode;
  inverse?: boolean;
  className?: string;
};

export function Tag({ children, inverse = false, className }: TagProps) {
  return (
    <span
      className={cn(
        "font-mono text-[0.6875rem] font-medium tracking-[0.12em] uppercase border border-current px-2 py-1 inline-flex items-center",
        inverse ? "ink-panel" : "bg-transparent text-current",
        className,
      )}
    >
      {children}
    </span>
  );
}
