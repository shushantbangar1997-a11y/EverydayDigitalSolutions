import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Switch, Route, Router as WouterRouter } from "wouter";
import type { BaseLocationHook } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import QuasarCaseStudy from "@/pages/quasar-case-study";

function makeStaticHook(path: string): BaseLocationHook {
  return () => [path, () => {}];
}

/**
 * Render a route to a full HTML string.
 * In React 19, renderToString hoists <title>, <meta>, <link>, and
 * <script type="application/ld+json"> tags inline into the output.
 * build-scripts/prerender.mjs extracts those tags and moves them to <head>.
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
