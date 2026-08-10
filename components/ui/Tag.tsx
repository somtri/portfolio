import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TagProps = {
  children: ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "font-mono text-[0.6875rem] font-medium tracking-[0.04em] border border-current px-2 py-1 inline-flex items-center bg-transparent text-current",
        className,
      )}
    >
      {children}
    </span>
  );
}
