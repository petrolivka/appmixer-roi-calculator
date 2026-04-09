"use client";

import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IntegrationRequirementsInputs, IntegrationComplexity, Currency } from "@/types/calculator";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface IntegrationRequirementsProps {
  data: IntegrationRequirementsInputs;
  currency: Currency;
  onUpdate: (updates: Partial<IntegrationRequirementsInputs>) => void;
}

const complexityOptions: { value: IntegrationComplexity; label: string; description: string }[] = [
  { value: "simple", label: "Simple", description: "Basic data sync, webhooks, one-way transfers" },
  { value: "medium", label: "Medium", description: "Multi-step workflows, data transformations" },
  { value: "complex", label: "Complex", description: "Custom logic, multiple systems, real-time sync" },
];

export function IntegrationRequirements({ data, currency, onUpdate }: IntegrationRequirementsProps) {
  return (
    <TooltipProvider>
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-2" variants={staggerItem}>
          <h2 className="text-2xl font-bold">Integration Requirements</h2>
          <p className="text-muted-foreground">
            Define your integration needs to calculate development and maintenance costs.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Number of Integrations */}
          <motion.div className="space-y-4" variants={staggerItem}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Number of Integrations Needed</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total number of third-party integrations you need to build or maintain</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {data.numberOfIntegrations}
              </span>
            </div>
            <Slider
              value={[data.numberOfIntegrations]}
              onValueChange={([v]) => onUpdate({ numberOfIntegrations: v })}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1</span>
              <span>50</span>
            </div>
          </motion.div>

          {/* Integration Complexity */}
          <motion.div className="space-y-3" variants={staggerItem}>
            <div className="flex items-center gap-2">
              <Label>Integration Complexity</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Affects development time and maintenance costs. Complex integrations require more resources.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {complexityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdate({ integrationComplexity: option.value })}
                  className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    data.integrationComplexity === option.value
                      ? "border-foreground/70 bg-foreground/5 shadow-sm"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Expected Monthly API Calls */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <div className="flex items-center gap-2">
              <Label htmlFor="apiCalls">Expected Monthly API Calls</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated total API calls across all integrations per month</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={String(data.expectedMonthlyApiCalls)}
              onValueChange={(v) => onUpdate({ expectedMonthlyApiCalls: parseInt(v) })}
            >
              <SelectTrigger id="apiCalls">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">Up to 10,000</SelectItem>
                <SelectItem value="50000">Up to 50,000</SelectItem>
                <SelectItem value="100000">Up to 100,000</SelectItem>
                <SelectItem value="250000">Up to 250,000</SelectItem>
                <SelectItem value="500000">Up to 500,000</SelectItem>
                <SelectItem value="1000000">Up to 1,000,000</SelectItem>
                <SelectItem value="5000000">1,000,000+</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Appmixer Monthly Cost */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <div className="flex items-center gap-2">
              <Label htmlFor="appmixerMonthlyCost">Appmixer Monthly Subscription</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Enter the monthly subscription cost from your Appmixer quote. Don&apos;t have one yet? Contact our sales team for a custom quote.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {CURRENCY_SYMBOLS[currency]}
              </span>
              <Input
                id="appmixerMonthlyCost"
                type="number"
                min={0}
                step={100}
                value={data.appmixerMonthlyCost || ""}
                onChange={(e) => onUpdate({ appmixerMonthlyCost: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 999"
                className="pl-7"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                /month
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have a quote?{" "}
              <a
                href="https://appmixer.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Contact us for custom pricing
              </a>
            </p>
          </motion.div>

          {/* Toggle Options */}
          <motion.div className="space-y-4" variants={staggerItem}>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="endUserFacing" className="cursor-pointer">
                    End-User Facing Integrations
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Integrations visible to and used by your customers</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your customers will interact with these integrations directly
                </p>
              </div>
              <Switch
                id="endUserFacing"
                checked={data.endUserFacing}
                onCheckedChange={(v) => onUpdate({ endUserFacing: v })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="selfHosted" className="cursor-pointer">
                    Self-Hosted Requirement
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Need to run the integration platform on your own infrastructure</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">
                  Deploy on your own servers for compliance or security needs
                </p>
              </div>
              <Switch
                id="selfHosted"
                checked={data.selfHostedRequired}
                onCheckedChange={(v) => onUpdate({ selfHostedRequired: v })}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
