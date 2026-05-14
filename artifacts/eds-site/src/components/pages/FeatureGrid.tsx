interface Feature {
  title: string;
  description: string;
}

interface FeatureGridProps {
  heading: string;
  features: Feature[];
}

export function FeatureGrid({ heading, features }: FeatureGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <h2 className="text-2xl sm:text-3xl font-serif mb-10 text-center">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass rounded-2xl p-6 hover:border-primary/60 transition-colors duration-300"
          >
            <span className="block w-1.5 h-1.5 rounded-full bg-primary mb-4" />
            <h3 className="font-medium text-foreground mb-2 text-sm">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
