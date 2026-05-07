interface PageHeroProps {
  tag?: string;
  headline: string;
  paragraph: string;
  cta?: { label: string; href: string };
}

export function PageHero({ tag, headline, paragraph, cta }: PageHeroProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-24 text-center">
      {tag && (
        <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
          {tag}
        </span>
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
        {headline}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
        {paragraph}
      </p>
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {cta.label}
        </a>
      )}
    </div>
  );
}
