"use client";

import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { CalculationResults } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, Clock, PiggyBank } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickResultsProps {
  results: CalculationResults;
  currency: Currency;
}

function AnimatedNumber({ value, duration = 1.0 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    const startTime = performance.now();
    const ms = duration * 1000;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ms, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display}</>;
}

export function QuickResults({ results, currency }: QuickResultsProps) {
  const { roiMetrics, customBuildCosts, appmixerCosts } = results;
  const fmtCompact = (v: number) => formatCurrency(v, currency, { compact: true });

  const barData = [
    {
      name: "Custom Build",
      value: customBuildCosts.yearlyBreakdown.total,
      fill: "hsl(0, 72%, 51%)",
    },
    {
      name: "Appmixer",
      value: appmixerCosts.yearlyBreakdown.total,
      fill: "hsl(var(--primary))",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${roiMetrics.roiPercentage}-${roiMetrics.threeYearSavings}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Hero metrics */}
        <div className="grid grid-cols-3 gap-4">
          <Card variant="glass">
            <CardContent className="p-5 text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-3xl font-bold text-gradient-primary">
                <AnimatedNumber value={roiMetrics.roiPercentage} />%
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-5 text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <PiggyBank className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">3-Year Savings</p>
              <p className="text-3xl font-bold text-emerald-600">
                {fmtCompact(roiMetrics.threeYearSavings)}
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-5 text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Payback</p>
              <p className="text-3xl font-bold">
                {roiMetrics.paybackPeriodMonths.toFixed(1)}
                <span className="text-base font-normal text-muted-foreground"> mo</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bar chart */}
        <Card variant="glass">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              3-Year Total Cost Comparison
            </p>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" barSize={36}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 13 }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v: number) => fmtCompact(v)}
                      style={{ fontSize: 14, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
