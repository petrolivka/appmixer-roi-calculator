"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressIndicator } from "./ProgressIndicator";
import { PreviewPanel } from "./PreviewPanel";
import { CompanyProfile } from "./steps/CompanyProfile";
import { IntegrationRequirements } from "./steps/IntegrationRequirements";
import { CurrentCosts } from "./steps/CurrentCosts";
import { useCalculator } from "@/hooks/useCalculator";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";

export function WizardContainer() {
  const router = useRouter();
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
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold mb-2">ROI Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your potential savings with Appmixer
          </p>
        </div>

        <ProgressIndicator
          currentStep={state.currentStep}
          onStepClick={(step) => {
            if (step <= state.currentStep) {
              setStep(step);
            }
          }}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Form Area */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              {renderStep()}

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
                  <Button onClick={handleViewResults}>
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

        {/* Mobile Preview Summary */}
        <div className="lg:hidden mt-6">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Projected ROI</p>
                  <p className="text-2xl font-bold text-primary">
                    {results.roiMetrics.roiPercentage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">3-Year Savings</p>
                  <p className="text-xl font-bold">
                    ${(results.roiMetrics.threeYearSavings / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
