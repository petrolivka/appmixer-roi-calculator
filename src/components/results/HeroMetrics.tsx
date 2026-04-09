"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import type { ROIMetrics, CurrentSpendComparison } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, Clock, PiggyBank, Target } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface HeroMetricsProps {
  metrics: ROIMetrics;
  currency: Currency;
  currentSpendComparison?: CurrentSpendComparison;
}

function AnimatedNumber({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    const startTime = performance.now();
    const ms = duration * 1000;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / ms, 1);
      // ease out cubic
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

export function HeroMetrics({ metrics, currency, currentSpendComparison }: HeroMetricsProps) {
  const cards = [
    {
      title: "Total ROI",
      value: `${metrics.roiPercentage}%`,
      numericValue: metrics.roiPercentage,
      suffix: "%",
      description: "Return on investment over 3 years",
      icon: TrendingUp,
      color: "primary" as const,
    },
    {
      title: "Payback Period",
      value: `${metrics.paybackPeriodMonths.toFixed(1)} mo`,
      description: "Time to recover your investment",
      icon: Clock,
      color: "slate" as const,
    },
    {
      title: "3-Year Savings",
      value: formatCurrency(metrics.threeYearSavings, currency, { compact: true }),
      description:
        currentSpendComparison?.hasCurrentSpend && currentSpendComparison.savingsPercentage > 0
          ? `${currentSpendComparison.savingsPercentage}% less than your current spend`
          : "Total cost savings vs. custom build",
      icon: PiggyBank,
      color: "emerald" as const,
    },
    {
      title: "Break-Even",
      value: `Month ${metrics.breakEvenMonth}`,
      description: "When savings exceed Appmixer costs",
      icon: Target,
      color: "amber" as const,
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      text: "text-gradient-primary",
      textFallback: "text-primary",
      icon: "text-primary",
    },
    slate: {
      bg: "bg-slate-100 dark:bg-slate-800/50",
      text: "text-slate-700 dark:text-slate-300",
      textFallback: "text-slate-700 dark:text-slate-300",
      icon: "text-slate-600",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-gradient-emerald",
      textFallback: "text-emerald-600",
      icon: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600",
      textFallback: "text-amber-600",
      icon: "text-amber-600",
    },
  };

  // Primary KPI (3-Year Savings) gets a hero treatment; others are secondary
  const primaryCard = cards[2]; // 3-Year Savings
  const secondaryCards = [cards[0], cards[1], cards[3]];

  return (
    <motion.div
      className="space-y-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Primary KPI — large, full-width */}
      <motion.div variants={staggerItem}>
        <Card variant="glass" className="ring-2 ring-emerald-200 dark:ring-emerald-800 shadow-lg shadow-emerald-500/10 bg-gradient-to-r from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-card">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <PiggyBank className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground">{primaryCard.title}</p>
                <p className="text-4xl sm:text-5xl font-bold text-gradient-emerald">
                  {primaryCard.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{primaryCard.description}</p>
              </div>
              <div className="hidden sm:block text-right space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Total ROI</div>
                <div className="text-2xl font-bold text-foreground">
                  {cards[0].numericValue !== undefined ? (
                    <>
                      <AnimatedNumber value={cards[0].numericValue} />%
                    </>
                  ) : cards[0].value}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Secondary KPIs — row of 3 */}
      <div className="grid gap-4 sm:grid-cols-3">
        {secondaryCards.map((card) => {
          const colors = colorClasses[card.color];
          return (
            <motion.div
              key={card.title}
              variants={staggerItem}
            >
              <Card variant="glass" className="h-full">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colors.bg}`}>
                      <card.icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{card.title}</p>
                      <p className={`text-2xl font-bold ${colors.text}`}>
                        {card.numericValue !== undefined ? (
                          <>
                            <AnimatedNumber value={card.numericValue} />
                            {card.suffix}
                          </>
                        ) : (
                          card.value
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
