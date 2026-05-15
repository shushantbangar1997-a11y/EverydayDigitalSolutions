import { useEffect, useState } from "react";
import { Link } from "wouter";
import { tracker, getConsentState } from "@/lib/tracker";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsentState() !== "unknown") return;
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  function onAccept() {
    void tracker.acceptConsent();
    setVisible(false);
  }

  function onDecline() {
    tracker.declineConsent();
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-sm"
    >
      <div className="rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl p-4 sm:p-5">
        <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
          We use first-party analytics — stored in our own database in India,
          no third-party trackers — to understand which content is useful and
          improve the site.{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-white"
          >
            How we handle your data
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onDecline}
            data-track="consent.decline"
            className="px-3 py-1.5 text-sm rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            data-track="consent.accept"
            className="px-4 py-1.5 text-sm rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
