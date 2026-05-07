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
 * All `useEffect` hooks that call GSAP / window APIs are skipped by renderToString.
 */
function makeStaticHook(path: string): BaseLocationHook {
  return () => [path, () => {}];
}

/**
 * Render a route's full React tree to an HTML string.
 * Called by build-scripts/prerender.mjs after `vite build --config vite.ssr.config.ts`.
 */
export function render(url: string): string {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  return renderToString(
    <HelmetProvider>
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
}
