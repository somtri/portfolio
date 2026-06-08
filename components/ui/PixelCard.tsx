import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelCardProps = {
  children: ReactNode;
  className?: string;
  inverse?: boolean;
};

export function PixelCard({
  children,
  className,
  inverse = false,
}: PixelCardProps) {
  return (
    <div
      className={cn(
        "relative border border-black p-5 sm:p-6",
        inverse
          ? "bg-black text-white"
          : "bg-[var(--surface)] text-[var(--ink)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute -right-px -top-px h-3 w-3 border-b border-l border-black",
          inverse ? "bg-white" : "bg-black",
        )}
      />
      {children}
    </div>
  );
}
