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
        "inline-flex items-center border border-current px-2 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em]",
        inverse ? "bg-black text-white" : "bg-transparent text-black",
        className,
      )}
    >
      {children}
    </span>
  );
}
