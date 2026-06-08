type SectionLabelProps = {
  children: string;
  index?: string;
};

export function SectionLabel({ children, index }: SectionLabelProps) {
  return (
    <div className="mb-5 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
      {index ? (
        <span className="border border-black bg-black px-2 py-1 text-white">
          {index}
        </span>
      ) : null}
      <span>[{children}]</span>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--line)]" />
    </div>
  );
}
