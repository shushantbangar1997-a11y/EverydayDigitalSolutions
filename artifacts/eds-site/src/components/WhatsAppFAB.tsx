import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/constants";

const HIDE_AFTER_PX = 700;

export function WhatsAppFAB() {
  const [location] = useLocation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function onScroll() {
      setHidden(window.scrollY > HIDE_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHidden(window.scrollY > HIDE_AFTER_PX);
  }, [location]);

  if (location.startsWith("/contact") || location.startsWith("/admin")) return null;
  if (hidden) return null;

  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex md:hidden items-center justify-center w-13 h-13 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ width: "52px", height: "52px" }}
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
