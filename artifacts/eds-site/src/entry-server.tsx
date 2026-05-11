import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { Switch, Route, Router as WouterRouter } from "wouter";
import type { BaseLocationHook } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import QuasarCaseStudy from "@/pages/quasar-case-study";
import Admin from "@/pages/admin";
import AppCostGuide2026 from "@/pages/resources/app-cost-guide-2026";

import MobileAppDevelopment from "@/pages/services/mobile-app-development";
import AIVoiceAgents from "@/pages/services/ai-voice-agents";
import AutomationSystems from "@/pages/services/automation-systems";

import Chandigarh from "@/pages/locations/chandigarh";
import Mohali from "@/pages/locations/mohali";
import Panchkula from "@/pages/locations/panchkula";
import Jalandhar from "@/pages/locations/jalandhar";
import Punjab from "@/pages/locations/punjab";

import SalonsAndSpas from "@/pages/solutions/salons-and-spas";
import RealEstate from "@/pages/solutions/real-estate";
import ClinicsAndHealthcare from "@/pages/solutions/clinics-and-healthcare";
import RestaurantsAndCafes from "@/pages/solutions/restaurants-and-cafes";

import BlogIndex from "@/pages/blog/index";
import BlogPost from "@/pages/blog/post";

import { blogPosts } from "@/content/blog";

export { blogPosts };

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
              <Route path="/admin" component={Admin} />
              <Route path="/resources/app-cost-guide-2026" component={AppCostGuide2026} />
              <Route path="/work/quasar-salon" component={QuasarCaseStudy} />

              <Route path="/services/mobile-app-development" component={MobileAppDevelopment} />
              <Route path="/services/ai-voice-agents" component={AIVoiceAgents} />
              <Route path="/services/automation-systems" component={AutomationSystems} />

              <Route path="/chandigarh" component={Chandigarh} />
              <Route path="/mohali" component={Mohali} />
              <Route path="/panchkula" component={Panchkula} />
              <Route path="/jalandhar" component={Jalandhar} />
              <Route path="/punjab" component={Punjab} />

              <Route path="/solutions/salons-and-spas" component={SalonsAndSpas} />
              <Route path="/solutions/real-estate" component={RealEstate} />
              <Route path="/solutions/clinics-and-healthcare" component={ClinicsAndHealthcare} />
              <Route path="/solutions/restaurants-and-cafes" component={RestaurantsAndCafes} />

              <Route path="/blog" component={BlogIndex} />
              <Route path="/blog/:slug" component={BlogPost} />
            </Switch>
          </WouterRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
