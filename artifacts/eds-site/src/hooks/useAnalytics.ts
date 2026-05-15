import { useEffect } from "react";
import { useLocation } from "wouter";
import { tracker, getConsentState } from "@/lib/tracker";

export function useAnalytics(): void {
  const [location] = useLocation();

  useEffect(() => {
    if (getConsentState() === "granted") {
      void tracker.start();
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const title = document.title;
    void tracker.recordPageview(location, title);
  }, [location]);
}
