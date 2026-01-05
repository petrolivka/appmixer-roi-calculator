"use client";

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
    <Card>
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
            <span className="text-lg font-bold">
              {CURRENCY_SYMBOLS[inputs.currency]}{companyProfile.developerHourlyCost}/hr
            </span>
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
            <span className="text-lg font-bold">
              {integrationRequirements.numberOfIntegrations}
            </span>
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

        {/* Integration Complexity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Integration Complexity</Label>
            <span className="text-lg font-bold capitalize">
              {integrationRequirements.integrationComplexity}
            </span>
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
