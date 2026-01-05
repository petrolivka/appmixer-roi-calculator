"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ROIMetrics } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, Clock, PiggyBank, Target } from "lucide-react";

interface HeroMetricsProps {
  metrics: ROIMetrics;
  currency: Currency;
}

export function HeroMetrics({ metrics, currency }: HeroMetricsProps) {
  const cards = [
    {
      title: "Total ROI",
      value: `${metrics.roiPercentage}%`,
      description: "Return on investment over 3 years",
      icon: TrendingUp,
      color: "primary",
    },
    {
      title: "Payback Period",
      value: `${metrics.paybackPeriodMonths.toFixed(1)} mo`,
      description: "Time to recover your investment",
      icon: Clock,
      color: "slate",
    },
    {
      title: "3-Year Savings",
      value: formatCurrency(metrics.threeYearSavings, currency, { compact: true }),
      description: "Total cost savings vs. custom build",
      icon: PiggyBank,
      color: "emerald",
    },
    {
      title: "Break-Even",
      value: `Month ${metrics.breakEvenMonth}`,
      description: "When savings exceed Appmixer costs",
      icon: Target,
      color: "amber",
    },
  ];

  const colorClasses = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      icon: "text-primary",
    },
    slate: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      icon: "text-slate-600",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      icon: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      icon: "text-amber-600",
    },
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const colors = colorClasses[card.color as keyof typeof colorClasses];
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colors.bg}`}>
                  <card.icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>{card.value}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
