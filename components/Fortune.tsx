const DEFAULT_TAIL = "arguing with opus 5";

type FortuneProps = {
  tail?: string;
};

export function Fortune({ tail = DEFAULT_TAIL }: FortuneProps) {
  return (
    <blockquote className="mt-6 max-w-3xl text-[28px] leading-[1.3] font-bold tracking-[-0.01em] text-[var(--ink)] sm:text-[36px]">
      currently training models and{" "}
      <span className="text-[var(--accent)]">{tail}</span>
    </blockquote>
  );
}
