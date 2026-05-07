import { Link } from "wouter";
import { site } from "@/lib/constants";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/#work" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/#about" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="block">
            <img 
              src="/logo.png" 
              alt="Everyday Digital Solutions" 
              className="h-10 w-auto invert brightness-105" 
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Link 
              href="/contact" 
              className="bg-primary text-black px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Book a call
            </Link>
          </nav>

          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col p-6">
          <div className="flex justify-end">
            <button 
              className="p-2 text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-6 mt-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-2xl font-serif"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link 
              href="/contact" 
              className="mt-6 bg-primary text-black px-6 py-4 text-center rounded-sm text-lg font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Book a call
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
