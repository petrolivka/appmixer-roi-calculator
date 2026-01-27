"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CalculationResults } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, Clock, PiggyBank } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

interface PreviewPanelProps {
  results: CalculationResults;
  currency: Currency;
}

export function PreviewPanel({ results, currency }: PreviewPanelProps) {
  const { roiMetrics } = results;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Card variant="glass" className="sticky top-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ROI Percentage */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projected ROI</p>
              <p className="text-2xl font-bold text-primary">
                {roiMetrics.roiPercentage}%
              </p>
            </div>
          </div>

          <Separator />

          {/* Payback Period */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payback Period</p>
              <p className="text-2xl font-bold">
                {roiMetrics.paybackPeriodMonths.toFixed(1)}{" "}
                <span className="text-base font-normal text-muted-foreground">months</span>
              </p>
            </div>
          </div>

          <Separator />

          {/* 3-Year Savings */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <PiggyBank className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">3-Year Savings</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(roiMetrics.threeYearSavings, currency, { compact: true })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Cost Comparison Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custom Build (3yr)</span>
              <span className="font-medium">
                {formatCurrency(results.customBuildCosts.yearlyBreakdown.total, currency, { compact: true })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Appmixer (3yr)</span>
              <span className="font-medium">
                {formatCurrency(results.appmixerCosts.yearlyBreakdown.total, currency, { compact: true })}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Results update as you change inputs
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
