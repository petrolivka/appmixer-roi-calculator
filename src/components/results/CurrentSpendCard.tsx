"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { CurrentSpendComparison } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { ArrowDownRight, ArrowUpRight, TrendingDown, Info } from "lucide-react";
import { chartReveal } from "@/lib/animations";

interface CurrentSpendCardProps {
  comparison: CurrentSpendComparison;
  currency: Currency;
}

export function CurrentSpendCard({ comparison, currency }: CurrentSpendCardProps) {
  if (!comparison.hasCurrentSpend) return null;

  const isSaving = comparison.threeYearSavings > 0;
  const fmt = (v: number) => formatCurrency(v, currency);
  const fmtCompact = (v: number) => formatCurrency(v, currency, { compact: true });

  const barData = [
    {
      name: "Current Spend",
      value: comparison.threeYearCurrentSpend,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Appmixer",
      value: comparison.threeYearAppmixerCost,
      fill: "hsl(var(--chart-2))",
    },
  ];

  return (
    <motion.div
      variants={chartReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card variant="glass" className="border-orange-200 dark:border-orange-800/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <CardTitle>Your Current Spend vs. Appmixer</CardTitle>
          </div>
          <CardDescription>
            Based on your reported annual integration spend of{" "}
            <span className="font-semibold text-foreground">
              {fmt(comparison.currentAnnualSpend)}/year
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Key metrics */}
            <div className="space-y-4">
              {/* Annual comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Annual</p>
                  <p className="text-2xl font-bold">{fmtCompact(comparison.currentAnnualSpend)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground mb-1">Appmixer Annual</p>
                  <p className="text-2xl font-bold text-primary">
                    {fmtCompact(comparison.appmixerAnnualCost)}
                  </p>
                </div>
              </div>

              {/* Savings callout */}
              {isSaving ? (
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      {comparison.savingsPercentage}% less per year
                    </span>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    Switch to Appmixer and save{" "}
                    <span className="font-bold">{fmt(comparison.annualSavings)}</span>{" "}
                    annually — that&apos;s{" "}
                    <span className="font-bold">{fmt(comparison.threeYearSavings)}</span>{" "}
                    over 3 years.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800 dark:text-blue-300">
                      Platform investment
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      While Appmixer costs more than your current solution, you gain significantly
                      faster integration builds, 70% lower maintenance, 95% automated error handling,
                      and accelerated time-to-market.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bar chart */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">3-Year Cost Comparison</p>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" barSize={40}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
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
              {isSaving && (
                <p className="text-center text-sm font-semibold text-emerald-600 mt-2">
                  You save {fmtCompact(comparison.threeYearSavings)} over 3 years
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
