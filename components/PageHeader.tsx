type PageHeaderProps = {
  title: string;
  summary: string;
};

export function PageHeader({ title, summary }: PageHeaderProps) {
  return (
    <header
      data-reveal
      className="site-container pb-10 pt-14 sm:pb-12 sm:pt-20"
    >
      <h1 className="page-title text-balance max-w-5xl">{title}</h1>
      <p className="text-pretty row-muted mt-5 max-w-3xl text-lg leading-8">
        {summary}
      </p>
      <div className="rule-strong mt-8" />
    </header>
  );
}
