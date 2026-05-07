import { Link } from "wouter";
import { site } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 pt-20 pb-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <img
                src="/logo.png"
                alt="Everyday Digital Solutions"
                className="h-8 w-auto invert brightness-105"
              />
              <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors leading-tight">
                Everyday<br />Digital Solutions
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Custom apps, AI voice agents, and automation systems for ambitious service businesses. Built in Mohali — shipping across India and beyond.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Studio</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="/#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</a></li>
              <li><a href="/#work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Work</a></li>
              <li><a href="/#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Process</a></li>
              <li><a href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Get in touch</h4>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/contact" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  Get a Free Quote
                </Link>
              </li>
              <li><a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a></li>
              <li><a href={`mailto:${site.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{site.email}</a></li>
              <li><a href={`tel:${site.phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{site.phone}</a></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2"></div>
          {site.offices.map((office, idx) => (
            <div key={idx}>
              <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{office.city}</h5>
              <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                {office.address.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </address>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Everyday Digital Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            AI &amp; Custom Software Studio · Mohali, Punjab, India
          </p>
        </div>
      </div>
    </footer>
  );
}
