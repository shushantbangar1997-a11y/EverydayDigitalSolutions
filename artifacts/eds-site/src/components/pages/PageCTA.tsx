import { Link } from "wouter";

interface PageCTAProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function PageCTA({
  heading = "Ready to get started?",
  subtext = "Tell us about your business. We will scope a solution and get back to you within one business day.",
  primaryLabel = "Start a Project",
  secondaryLabel = "Back to Home",
  secondaryHref = "/",
}: PageCTAProps) {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="glass-elevated rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-serif mb-4">{heading}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">{subtext}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            data-float=""
            className="btn-glass-primary px-8 py-4 rounded-full font-medium transition-colors w-full sm:w-auto text-center"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            data-float=""
            className="btn-glass-neutral text-foreground px-8 py-4 rounded-full font-medium transition-colors w-full sm:w-auto text-center"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
