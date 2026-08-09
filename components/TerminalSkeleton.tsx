type TerminalSkeletonProps = {
  rows: number[];
};

export function TerminalSkeleton({ rows }: TerminalSkeletonProps) {
  return (
    <div className="terminal-skeleton">
      {rows.map((width, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="terminal-skeleton__row"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          {"░".repeat(width)}
        </span>
      ))}
    </div>
  );
}
