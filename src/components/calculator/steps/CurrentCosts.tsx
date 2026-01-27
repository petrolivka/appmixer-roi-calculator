"use client";

import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CurrentCostsInputs, Currency } from "@/types/calculator";
import { CURRENCY_SYMBOLS } from "@/lib/currency";
import { HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface CurrentCostsProps {
  data: CurrentCostsInputs;
  currency: Currency;
  onUpdate: (updates: Partial<CurrentCostsInputs>) => void;
}

export function CurrentCosts({ data, currency, onUpdate }: CurrentCostsProps) {
  return (
    <TooltipProvider>
      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-2" variants={staggerItem}>
          <h2 className="text-2xl font-bold">Current Costs</h2>
          <p className="text-muted-foreground">
            Help us understand your current integration spend for more accurate projections.
          </p>
        </motion.div>

        <motion.div
          className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-4 flex gap-3"
          variants={staggerItem}
        >
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">This step is optional</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              If you don&apos;t have exact figures, we&apos;ll use industry benchmarks to estimate costs.
              Providing your actual numbers will make the ROI calculation more accurate.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {/* Current Integration Spend */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <div className="flex items-center gap-2">
              <Label htmlFor="currentSpend">Current Integration Spend (Annual)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Total annual spend on integration tools, platforms, or services (excluding developer time)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {CURRENCY_SYMBOLS[currency]}
              </span>
              <Input
                id="currentSpend"
                type="number"
                min={0}
                className="pl-8"
                placeholder="0"
                value={data.currentIntegrationSpend || ""}
                onChange={(e) =>
                  onUpdate({ currentIntegrationSpend: parseInt(e.target.value) || 0 })
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                /year
              </span>
            </div>
          </motion.div>

          {/* Dev Hours on Integration */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <div className="flex items-center gap-2">
              <Label htmlFor="devHours">Developer Hours on Integration (Monthly)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Total hours your team spends building, maintaining, and troubleshooting integrations each month</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                id="devHours"
                type="number"
                min={0}
                max={1000}
                placeholder="40"
                value={data.devHoursOnIntegrationPerMonth || ""}
                onChange={(e) =>
                  onUpdate({ devHoursOnIntegrationPerMonth: parseInt(e.target.value) || 0 })
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                hours/month
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Average is 40-80 hours/month for mid-sized teams
            </p>
          </motion.div>

          {/* Integration Incidents */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <div className="flex items-center gap-2">
              <Label htmlFor="incidents">Integration-Related Incidents (Monthly)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Number of integration failures, errors, or issues requiring developer attention each month</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                id="incidents"
                type="number"
                min={0}
                max={100}
                placeholder="5"
                value={data.integrationIncidentsPerMonth || ""}
                onChange={(e) =>
                  onUpdate({ integrationIncidentsPerMonth: parseInt(e.target.value) || 0 })
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                incidents/month
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Each incident costs approximately {CURRENCY_SYMBOLS[currency]}500 in developer time on average
            </p>
          </motion.div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
