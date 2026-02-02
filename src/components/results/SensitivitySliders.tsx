"use client";

import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { CalculatorInputs, IntegrationComplexity } from "@/types/calculator";
import { CURRENCY_SYMBOLS } from "@/lib/currency";

interface SensitivitySlidersProps {
  inputs: CalculatorInputs;
  onUpdate: (updates: Partial<CalculatorInputs>) => void;
}

export function SensitivitySliders({ inputs, onUpdate }: SensitivitySlidersProps) {
  const { companyProfile, integrationRequirements } = inputs;

  const handleDevCostChange = (value: number[]) => {
    onUpdate({
      companyProfile: {
        ...companyProfile,
        developerHourlyCost: value[0],
      },
    });
  };

  const handleIntegrationsChange = (value: number[]) => {
    onUpdate({
      integrationRequirements: {
        ...integrationRequirements,
        numberOfIntegrations: value[0],
      },
    });
  };

  const handleSubscriptionChange = (value: number[]) => {
    onUpdate({
      integrationRequirements: {
        ...integrationRequirements,
        appmixerMonthlyCost: value[0],
      },
    });
  };

  const complexityOptions: IntegrationComplexity[] = ["simple", "medium", "complex"];
  const complexityIndex = complexityOptions.indexOf(integrationRequirements.integrationComplexity);

  const handleComplexityChange = (value: number[]) => {
    onUpdate({
      integrationRequirements: {
        ...integrationRequirements,
        integrationComplexity: complexityOptions[value[0]],
      },
    });
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Sensitivity Analysis</CardTitle>
        <CardDescription>
          Adjust key assumptions to see how they impact your ROI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Developer Hourly Cost */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Developer Hourly Cost</Label>
            <AnimatePresence mode="wait">
              <motion.span
                key={companyProfile.developerHourlyCost}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="text-lg font-bold"
              >
                {CURRENCY_SYMBOLS[inputs.currency]}{companyProfile.developerHourlyCost}/hr
              </motion.span>
            </AnimatePresence>
          </div>
          <Slider
            value={[companyProfile.developerHourlyCost]}
            onValueChange={handleDevCostChange}
            min={30}
            max={250}
            step={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{CURRENCY_SYMBOLS[inputs.currency]}30</span>
            <span>{CURRENCY_SYMBOLS[inputs.currency]}250</span>
          </div>
        </div>

        {/* Number of Integrations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Number of Integrations</Label>
            <AnimatePresence mode="wait">
              <motion.span
                key={integrationRequirements.numberOfIntegrations}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="text-lg font-bold"
              >
                {integrationRequirements.numberOfIntegrations}
              </motion.span>
            </AnimatePresence>
          </div>
          <Slider
            value={[integrationRequirements.numberOfIntegrations]}
            onValueChange={handleIntegrationsChange}
            min={1}
            max={50}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>50</span>
          </div>
        </div>

        {/* Appmixer Monthly Subscription */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Appmixer Monthly Cost</Label>
            <AnimatePresence mode="wait">
              <motion.span
                key={integrationRequirements.appmixerMonthlyCost}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="text-lg font-bold"
              >
                {CURRENCY_SYMBOLS[inputs.currency]}{integrationRequirements.appmixerMonthlyCost}/mo
              </motion.span>
            </AnimatePresence>
          </div>
          <Slider
            value={[integrationRequirements.appmixerMonthlyCost]}
            onValueChange={handleSubscriptionChange}
            min={100}
            max={5000}
            step={100}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{CURRENCY_SYMBOLS[inputs.currency]}100</span>
            <span>{CURRENCY_SYMBOLS[inputs.currency]}5,000</span>
          </div>
        </div>

        {/* Integration Complexity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Integration Complexity</Label>
            <AnimatePresence mode="wait">
              <motion.span
                key={integrationRequirements.integrationComplexity}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="text-lg font-bold capitalize"
              >
                {integrationRequirements.integrationComplexity}
              </motion.span>
            </AnimatePresence>
          </div>
          <Slider
            value={[complexityIndex]}
            onValueChange={handleComplexityChange}
            min={0}
            max={2}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Simple</span>
            <span>Medium</span>
            <span>Complex</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2 border-t">
          Results update automatically as you adjust these values
        </p>
      </CardContent>
    </Card>
  );
}
