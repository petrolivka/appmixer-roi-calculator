"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { BenefitBreakdown } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";

interface BenefitBreakdownChartProps {
  benefits: BenefitBreakdown;
  currency: Currency;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(221, 83%, 63%)",
];

const BENEFIT_LABELS: Record<keyof Omit<BenefitBreakdown, "total">, string> = {
  developmentTimeSavings: "Dev Time Savings",
  maintenanceReduction: "Maintenance Reduction",
  timeToMarketValue: "Time-to-Market",
  errorReduction: "Error Reduction",
  churnReduction: "Churn Reduction",
  dealWinRateImprovement: "Deal Win Rate",
};

export function BenefitBreakdownChart({ benefits, currency }: BenefitBreakdownChartProps) {
  const data = Object.entries(benefits)
    .filter(([key, value]) => key !== "total" && value > 0)
    .map(([key, value]) => ({
      name: BENEFIT_LABELS[key as keyof typeof BENEFIT_LABELS],
      value: value as number,
    }));

  const formatTooltip = (value: number) => formatCurrency(value, currency);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benefit Breakdown</CardTitle>
        <CardDescription>
          Where your savings come from — Total: {formatCurrency(benefits.total, currency)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-medium">
                {formatCurrency(item.value, currency, { compact: true })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
