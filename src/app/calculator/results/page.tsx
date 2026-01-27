"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { HeroMetrics } from "@/components/results/HeroMetrics";
import { CostComparisonChart } from "@/components/results/CostComparisonChart";
import { BreakEvenChart } from "@/components/results/BreakEvenChart";
import { BenefitBreakdownChart } from "@/components/results/BenefitBreakdownChart";
import { SensitivitySliders } from "@/components/results/SensitivitySliders";
import { ActionButtons } from "@/components/results/ActionButtons";
import { CostBreakdownTable } from "@/components/results/CostBreakdownTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateROI } from "@/lib/calculations";
import type { CalculatorInputs } from "@/types/calculator";
import { defaultCalculatorInputs } from "@/types/calculator";
import { fadeInUp } from "@/lib/animations";

function ResultsContent() {
  const searchParams = useSearchParams();

  // Parse inputs from URL or use defaults
  const initialInputs = useMemo(() => {
    const dataParam = searchParams.get("data");
    if (dataParam) {
      try {
        const parsed = JSON.parse(atob(dataParam));
        return {
          ...defaultCalculatorInputs,
          ...parsed,
        } as CalculatorInputs;
      } catch {
        return defaultCalculatorInputs;
      }
    }
    return defaultCalculatorInputs;
  }, [searchParams]);

  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const results = useMemo(() => calculateROI(inputs), [inputs]);

  const handleInputUpdate = useCallback((updates: Partial<CalculatorInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...updates,
      companyProfile: {
        ...prev.companyProfile,
        ...(updates.companyProfile || {}),
      },
      integrationRequirements: {
        ...prev.integrationRequirements,
        ...(updates.integrationRequirements || {}),
      },
      currentCosts: {
        ...prev.currentCosts,
        ...(updates.currentCosts || {}),
      },
    }));
  }, []);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      // Dynamic import to avoid SSR issues
      const { generatePdfReport } = await import("@/lib/pdf/generateReport");
      await generatePdfReport(inputs, results);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "My Appmixer ROI Calculation",
        text: `Check out my ROI calculation: ${results.roiMetrics.roiPercentage}% ROI with ${results.roiMetrics.paybackPeriodMonths} month payback`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-mesh-gradient">
      <header className="border-b bg-white/70 backdrop-blur-xl dark:bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <Image src="/logo.svg" alt="Appmixer" width={140} height={40} priority />
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Back to Calculator
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="font-heading text-3xl font-bold mb-2">Your ROI Results</h1>
          <p className="text-muted-foreground">
            Based on your inputs, here&apos;s your projected return on investment with
            Appmixer
          </p>
        </motion.div>

        {/* Hero Metrics */}
        <div className="mb-10">
          <HeroMetrics metrics={results.roiMetrics} currency={inputs.currency} />
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Cost Details</TabsTrigger>
            <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <CostComparisonChart
                customBuildCosts={results.customBuildCosts}
                appmixerCosts={results.appmixerCosts}
                currency={inputs.currency}
              />
              <BreakEvenChart
                monthlyProjection={results.monthlyProjection}
                breakEvenMonth={results.roiMetrics.breakEvenMonth}
                currency={inputs.currency}
              />
            </div>
            <BenefitBreakdownChart
              benefits={results.benefits}
              currency={inputs.currency}
            />
          </TabsContent>

          <TabsContent value="details">
            <CostBreakdownTable
              customBuildCosts={results.customBuildCosts}
              appmixerCosts={results.appmixerCosts}
              currency={inputs.currency}
            />
          </TabsContent>

          <TabsContent value="sensitivity">
            <div className="grid gap-8 lg:grid-cols-2">
              <SensitivitySliders inputs={inputs} onUpdate={handleInputUpdate} />
              <div className="space-y-8">
                <CostComparisonChart
                  customBuildCosts={results.customBuildCosts}
                  appmixerCosts={results.appmixerCosts}
                  currency={inputs.currency}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-10">
          <ActionButtons
            onDownloadPdf={handleDownloadPdf}
            onShare={handleShare}
            isGeneratingPdf={isGeneratingPdf}
          />
        </div>

        {/* Methodology Note */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>
            Calculations based on industry benchmarks from Nucleus Research, Informatica,
            and Gartner studies.
          </p>
          <p className="mt-1">
            Actual results may vary based on your specific implementation and usage patterns.
          </p>
          <p className="mt-3">
            <a href="/methodology" className="text-primary hover:underline font-medium">
              View our calculation methodology
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
