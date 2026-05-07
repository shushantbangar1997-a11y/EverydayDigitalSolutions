import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Switch, Route, Router as WouterRouter } from "wouter";
import type { BaseLocationHook } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import QuasarCaseStudy from "@/pages/quasar-case-study";

/**
 * Static router hook for SSR — returns a fixed path with a no-op navigator.
 * All `useEffect` hooks (GSAP, window APIs) are skipped by renderToString.
 */
function makeStaticHook(path: string): BaseLocationHook {
  return () => [path, () => {}];
}

export interface RenderResult {
  appHtml: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  helmet: Record<string, any>;
}

/**
 * Render a route to HTML and capture all Helmet head tags.
 *
 * Called by build-scripts/prerender.mjs after `vite build --config vite.ssr.config.ts`.
 * The caller uses `helmet.title/meta/link/script.toString()` to inject the
 * full per-route head (OG, Twitter, canonical, JSON-LD) into the static HTML.
 */
export function render(url: string): RenderResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const helmetContext: Record<string, any> = {};

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter hook={makeStaticHook(url)}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/contact" component={Contact} />
              <Route path="/work/quasar-salon" component={QuasarCaseStudy} />
            </Switch>
          </WouterRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  return { appHtml, helmet: helmetContext.helmet ?? {} };
}
