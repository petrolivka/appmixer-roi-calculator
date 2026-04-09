"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressIndicator } from "./ProgressIndicator";
import { PreviewPanel } from "./PreviewPanel";
import { CompanyProfile } from "./steps/CompanyProfile";
import { IntegrationRequirements } from "./steps/IntegrationRequirements";
import { CurrentCosts } from "./steps/CurrentCosts";
import { useCalculator } from "@/hooks/useCalculator";
import { ChevronLeft, ChevronRight, BarChart3, Info } from "lucide-react";
import { slideInFromRight, fadeInUp } from "@/lib/animations";
import { buildQuickInputs } from "@/lib/constants/quickDefaults";

export function WizardContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    results,
    nextStep,
    prevStep,
    setStep,
    setCurrency,
    updateCompanyProfile,
    updateIntegrationRequirements,
    updateCurrentCosts,
  } = useCalculator();

  // Check for quick mode pre-fill
  const quickParam = searchParams.get("quick");
  const isFromQuick = !!quickParam;
  const [quickBannerDismissed, setQuickBannerDismissed] = useState(false);

  // Apply quick defaults on first render
  const [quickApplied, setQuickApplied] = useState(false);
  if (quickParam && !quickApplied) {
    try {
      const parsed = JSON.parse(atob(quickParam));
      const quickInputs = buildQuickInputs(
        parsed.companySize || "mid-market",
        parsed.numberOfIntegrations || 10,
        parsed.integrationComplexity || "medium"
      );
      updateCompanyProfile(quickInputs.companyProfile);
      updateIntegrationRequirements(quickInputs.integrationRequirements);
      updateCurrentCosts(quickInputs.currentCosts);
      setCurrency(quickInputs.currency);
      setQuickApplied(true);
    } catch {
      setQuickApplied(true);
    }
  }

  const handleViewResults = () => {
    // Encode state in URL for sharing
    const params = new URLSearchParams({
      data: btoa(JSON.stringify({
        companyProfile: state.companyProfile,
        integrationRequirements: state.integrationRequirements,
        currentCosts: state.currentCosts,
        currency: state.currency,
      })),
    });
    router.push(`/calculator/results?${params.toString()}`);
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <CompanyProfile
            data={state.companyProfile}
            currency={state.currency}
            onUpdate={updateCompanyProfile}
            onCurrencyChange={setCurrency}
          />
        );
      case 2:
        return (
          <IntegrationRequirements
            data={state.integrationRequirements}
            currency={state.currency}
            onUpdate={updateIntegrationRequirements}
          />
        );
      case 3:
        return (
          <CurrentCosts
            data={state.currentCosts}
            currency={state.currency}
            onUpdate={updateCurrentCosts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-mesh-gradient">
      <header className="border-b bg-white/70 backdrop-blur-xl dark:bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <Image src="/logo.svg" alt="Appmixer" width={140} height={40} priority />
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="font-heading text-3xl font-bold mb-2">ROI Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your potential savings with Appmixer
          </p>
          {!isFromQuick && (
            <p className="mt-2 text-sm">
              <Link href="/calculator/quick" className="text-primary hover:underline font-medium">
                Short on time? Try our 30-second quick estimate →
              </Link>
            </p>
          )}
        </motion.div>

        <ProgressIndicator
          currentStep={state.currentStep}
          onStepClick={(step) => {
            if (step <= state.currentStep) {
              setStep(step);
            }
          }}
        />

        {/* Quick mode banner */}
        {isFromQuick && !quickBannerDismissed && (
          <motion.div
            className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Pre-filled from your quick estimate
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Review and adjust the inputs below for a more accurate ROI calculation.
              </p>
            </div>
            <button
              onClick={() => setQuickBannerDismissed(true)}
              className="text-amber-600 hover:text-amber-800 text-sm font-medium"
            >
              ✕
            </button>
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Form Area */}
          <Card variant="glass">
            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.currentStep}
                  variants={slideInFromRight}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={state.currentStep === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {state.currentStep < 3 ? (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={handleViewResults}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel (hidden on mobile, shown as sticky sidebar on desktop) */}
          <div className="hidden lg:block">
            <PreviewPanel results={results} currency={state.currency} />
          </div>
        </div>

        {/* Mobile Preview Summary — sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-xl dark:bg-card/95 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Projected ROI</p>
                <p className="text-xl font-bold text-foreground">
                  {results.roiMetrics.roiPercentage}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">3-Year Savings</p>
                <p className="text-xl font-bold text-emerald-600">
                  ${(results.roiMetrics.threeYearSavings / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Payback</p>
                <p className="text-lg font-bold text-foreground">
                  {results.roiMetrics.paybackPeriodMonths.toFixed(1)} mo
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom spacer for sticky bar on mobile */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}
