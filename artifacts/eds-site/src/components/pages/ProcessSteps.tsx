interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  heading?: string;
  steps: ProcessStep[];
}

export function ProcessSteps({ heading = "How we work", steps }: ProcessStepsProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      {heading && (
        <h2 className="text-2xl sm:text-3xl font-serif mb-10 text-center">{heading}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col gap-3">
            <span className="text-xs font-mono text-primary">{s.step}</span>
            <h3 className="font-serif text-lg text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
