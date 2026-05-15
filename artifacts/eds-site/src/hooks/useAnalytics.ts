import { useEffect } from "react";
import { useLocation } from "wouter";
import { tracker } from "@/lib/tracker";

export function useAnalytics(): void {
  const [location] = useLocation();

  useEffect(() => {
    // tracker.start() is a no-op if the visitor explicitly opted out
    // (eds_consent=denied in localStorage) or if their browser has DNT set.
    void tracker.start();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const title = document.title;
    void tracker.recordPageview(location, title);
  }, [location]);
}
