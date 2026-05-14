import { lazy, Suspense, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { canUseWebGL } from "@/lib/canUseWebGL";
import { useGlassFloat } from "@/hooks/useGlassFloat";
import { LiquidGlassFilter } from "@/components/LiquidGlassFilter";
import NotFound from "@/pages/not-found";

const AmbientCanvas = lazy(() =>
  import("@/components/AmbientCanvas").then((m) => ({ default: m.AmbientCanvas }))
);
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import QuasarCaseStudy from "@/pages/quasar-case-study";
import OpenHumanaCaseStudy from "@/pages/work/open-humana";
import Admin from "@/pages/admin";
import RequestReview from "@/pages/admin/request-review";
import AppCostGuide2026 from "@/pages/resources/app-cost-guide-2026";
import GetAQuote from "@/pages/get-a-quote";

import MobileAppDevelopment from "@/pages/services/mobile-app-development";
import AIVoiceAgents from "@/pages/services/ai-voice-agents";
import AutomationSystems from "@/pages/services/automation-systems";

import Chandigarh from "@/pages/locations/chandigarh";
import Mohali from "@/pages/locations/mohali";
import Panchkula from "@/pages/locations/panchkula";
import Jalandhar from "@/pages/locations/jalandhar";
import Punjab from "@/pages/locations/punjab";

import ChandigarhSector17 from "@/pages/chandigarh/sector-17";
import ChandigarhSector22 from "@/pages/chandigarh/sector-22";
import ChandigarhIndustrialAreaPhase1 from "@/pages/chandigarh/industrial-area-phase-1";
import MohaliPhase7 from "@/pages/mohali/phase-7";
import MohaliPhase8bItPark from "@/pages/mohali/phase-8b-it-park";
import MohaliSector82Aerocity from "@/pages/mohali/sector-82-aerocity";
import JalandharModelTown from "@/pages/jalandhar/model-town";
import JalandharCivilLines from "@/pages/jalandhar/civil-lines";

import AppCostCalculator from "@/pages/tools/app-cost-calculator";
import AIVoiceAgentROICalculator from "@/pages/tools/ai-voice-agent-roi-calculator";

import SalonsAndSpas from "@/pages/solutions/salons-and-spas";
import RealEstate from "@/pages/solutions/real-estate";
import ClinicsAndHealthcare from "@/pages/solutions/clinics-and-healthcare";
import RestaurantsAndCafes from "@/pages/solutions/restaurants-and-cafes";

import BlogIndex from "@/pages/blog/index";
import BlogPost from "@/pages/blog/post";

import { StickyCTA } from "@/components/StickyCTA";
import { ExitIntent } from "@/components/ExitIntent";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { PageTransition } from "@/components/PageTransition";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/request-review" component={RequestReview} />
      <Route path="/resources/app-cost-guide-2026" component={AppCostGuide2026} />
      <Route path="/work/quasar-salon" component={QuasarCaseStudy} />
      <Route path="/work/open-humana" component={OpenHumanaCaseStudy} />

      <Route path="/services/mobile-app-development" component={MobileAppDevelopment} />
      <Route path="/services/ai-voice-agents" component={AIVoiceAgents} />
      <Route path="/services/automation-systems" component={AutomationSystems} />

      <Route path="/chandigarh" component={Chandigarh} />
      <Route path="/chandigarh/sector-17" component={ChandigarhSector17} />
      <Route path="/chandigarh/sector-22" component={ChandigarhSector22} />
      <Route path="/chandigarh/industrial-area-phase-1" component={ChandigarhIndustrialAreaPhase1} />
      <Route path="/mohali" component={Mohali} />
      <Route path="/mohali/phase-7" component={MohaliPhase7} />
      <Route path="/mohali/phase-8b-it-park" component={MohaliPhase8bItPark} />
      <Route path="/mohali/sector-82-aerocity" component={MohaliSector82Aerocity} />
      <Route path="/panchkula" component={Panchkula} />
      <Route path="/jalandhar" component={Jalandhar} />
      <Route path="/jalandhar/model-town" component={JalandharModelTown} />
      <Route path="/jalandhar/civil-lines" component={JalandharCivilLines} />
      <Route path="/punjab" component={Punjab} />

      <Route path="/get-a-quote" component={GetAQuote} />

      <Route path="/tools/app-cost-calculator" component={AppCostCalculator} />
      <Route path="/tools/ai-voice-agent-roi-calculator" component={AIVoiceAgentROICalculator} />

      <Route path="/solutions/salons-and-spas" component={SalonsAndSpas} />
      <Route path="/solutions/real-estate" component={RealEstate} />
      <Route path="/solutions/clinics-and-healthcare" component={ClinicsAndHealthcare} />
      <Route path="/solutions/restaurants-and-cafes" component={RestaurantsAndCafes} />

      <Route path="/blog" component={BlogIndex} />
      <Route path="/blog/:slug" component={BlogPost} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showAmbient] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return canUseWebGL();
  });
  useGlassFloat();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LiquidGlassFilter />
        {showAmbient && (
          <Suspense fallback={null}>
            <AmbientCanvas />
          </Suspense>
        )}
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <PageTransition>
            <Router />
          </PageTransition>
          <StickyCTA />
          <ExitIntent />
          <WhatsAppFAB />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
