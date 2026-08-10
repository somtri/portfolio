type PageHeaderProps = {
  command: string;
  summary: string;
  annotation?: string;
};

export function PageHeader({ command, summary, annotation }: PageHeaderProps) {
  return (
    <header className="site-container pt-16 pb-10 sm:pt-24">
      <div className="flex flex-col gap-2 text-[11px] text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between sm:text-[11.5px]">
        <span>[ 42.026&deg;n 93.646&deg;w ]</span>
        {annotation ? <span>[ {annotation} ]</span> : null}
      </div>

      <h1 className="mt-10 text-sm font-normal text-[var(--muted)]">
        <span className="text-[var(--accent)]" aria-hidden="true">$</span> {command}
      </h1>

      <p className="mt-6 max-w-3xl text-[14.5px] leading-7 text-[var(--muted)]">
        {summary}
      </p>
    </header>
  );
}
