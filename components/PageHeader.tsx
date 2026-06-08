type PageHeaderProps = {
  title: string;
  summary: string;
};

export function PageHeader({ title, summary }: PageHeaderProps) {
  return (
    <header
      data-reveal
      className="site-container pb-12 pt-14 sm:pb-16 sm:pt-20"
    >
      <div className="border border-black bg-[var(--surface)] p-6 shadow-[7px_7px_0_var(--shadow)] sm:p-10">
        <h1 className="text-balance max-w-5xl font-mono text-4xl font-black uppercase leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="text-pretty mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
          {summary}
        </p>
      </div>
    </header>
  );
}
