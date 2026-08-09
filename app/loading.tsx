import { TerminalSkeleton } from "@/components/TerminalSkeleton";

export default function Loading() {
  return (
    <div className="site-container pb-20 pt-14 sm:pt-20" role="status">
      <span className="sr-only">loading</span>
      <p aria-hidden="true" className="flex items-center gap-2 text-[13.5px]">
        <span className="text-[var(--accent)]">$</span>
        <span className="text-[var(--muted)]">loading ./page</span>
        <span className="ask-cursor" aria-hidden="true" />
      </p>
      <div className="mt-6">
        <TerminalSkeleton rows={[64, 48, 56, 32]} />
      </div>
    </div>
  );
}
