import { Link } from "wouter";
import { site } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 pt-14 pb-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 lg:mb-20">
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-start gap-3 mb-5 group w-fit">
              <img
                src="/logo.png"
                alt="Everyday Digital Solutions"
                className="h-8 w-auto invert brightness-105 mt-0.5 flex-shrink-0"
              />
              <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors leading-snug">
                Everyday<br />Digital Solutions
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Custom apps, AI voice agents, and automation systems for ambitious service businesses. Built in Mohali — shipping across India and beyond.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-base lg:text-lg mb-5">Studio</h4>
            <ul className="flex flex-col gap-3 lg:gap-4">
              <li><a href="/#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</a></li>
              <li><a href="/#work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Work</a></li>
              <li><a href="/#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Process</a></li>
              <li><a href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base lg:text-lg mb-5">Get in touch</h4>
            <ul className="flex flex-col gap-3 lg:gap-4">
              <li>
                <Link href="/contact" className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  Start a Project
                </Link>
              </li>
              <li><a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a></li>
              <li><a href={`mailto:${site.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors break-all">{site.email}</a></li>
              <li><a href={`tel:${site.phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{site.phone}</a></li>
            </ul>
          </div>
        </div>

        {/* Offices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 pb-12 border-b border-border/40">
          {site.offices.map((office, idx) => (
            <div key={idx}>
              <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{office.city}</h5>
              <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                {office.address.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </address>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
