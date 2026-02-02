"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QuickResults } from "./QuickResults";
import { buildQuickInputs } from "@/lib/constants/quickDefaults";
import { calculateROI } from "@/lib/calculations";
import type { CompanySize, IntegrationComplexity } from "@/types/calculator";
import { BarChart3, ArrowRight, Zap } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";

const companySizeOptions: { value: CompanySize; label: string; emoji: string }[] = [
  { value: "smb", label: "SMB", emoji: "🏢" },
  { value: "mid-market", label: "Mid-Market", emoji: "🏛️" },
  { value: "enterprise", label: "Enterprise", emoji: "🌐" },
];

const complexityOptions: { value: IntegrationComplexity; label: string; description: string }[] = [
  { value: "simple", label: "Simple", description: "Data sync, webhooks" },
  { value: "medium", label: "Medium", description: "Multi-step workflows" },
  { value: "complex", label: "Complex", description: "Custom logic, real-time" },
];

export function QuickCalculator() {
  const router = useRouter();
  const [companySize, setCompanySize] = useState<CompanySize>("mid-market");
  const [numberOfIntegrations, setNumberOfIntegrations] = useState(10);
  const [complexity, setComplexity] = useState<IntegrationComplexity>("medium");

  const inputs = useMemo(
    () => buildQuickInputs(companySize, numberOfIntegrations, complexity),
    [companySize, numberOfIntegrations, complexity]
  );

  const results = useMemo(() => calculateROI(inputs), [inputs]);

  const handleRunFull = () => {
    const params = new URLSearchParams({
      quick: btoa(
        JSON.stringify({
          companySize,
          numberOfIntegrations,
          integrationComplexity: complexity,
        })
      ),
    });
    router.push(`/calculator?${params.toString()}`);
  };

  const handleViewResults = () => {
    const params = new URLSearchParams({
      data: btoa(JSON.stringify(inputs)),
    });
    router.push(`/calculator/results?${params.toString()}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 items-start">
      {/* Inputs */}
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Company Size */}
        <motion.div className="space-y-3" variants={staggerItem}>
          <Label className="text-base font-semibold">Company Size</Label>
          <div className="grid grid-cols-3 gap-3">
            {companySizeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCompanySize(option.value)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  companySize === option.value
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                    : "border-muted hover:border-muted-foreground/50 hover:shadow-sm"
                }`}
              >
                <span className="text-2xl mb-1">{option.emoji}</span>
                <span className="font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Number of Integrations */}
        <motion.div className="space-y-4" variants={staggerItem}>
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              Number of Integrations
            </Label>
            <span className="text-3xl font-bold text-primary">
              {numberOfIntegrations}
            </span>
          </div>
          <Slider
            value={[numberOfIntegrations]}
            onValueChange={([v]) => setNumberOfIntegrations(v)}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1</span>
            <span>25</span>
            <span>50</span>
          </div>
        </motion.div>

        {/* Integration Complexity */}
        <motion.div className="space-y-3" variants={staggerItem}>
          <Label className="text-base font-semibold">Complexity</Label>
          <div className="grid grid-cols-3 gap-3">
            {complexityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setComplexity(option.value)}
                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  complexity === option.value
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                    : "border-muted hover:border-muted-foreground/50 hover:shadow-sm"
                }`}
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row gap-3 pt-2" variants={staggerItem}>
          <Button variant="gradient" size="lg" onClick={handleViewResults} className="flex-1">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Full Results
          </Button>
          <Button variant="outline" size="lg" onClick={handleRunFull} className="flex-1">
            Customize Inputs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Live Results */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="lg:sticky lg:top-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-lg">Your Estimate</h3>
          </div>
          <QuickResults results={results} currency={inputs.currency} />
        </div>
      </motion.div>
    </div>
  );
}
