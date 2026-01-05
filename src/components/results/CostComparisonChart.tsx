"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CustomBuildCosts, AppmixerCosts } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency, CURRENCY_SYMBOLS } from "@/lib/currency";

interface CostComparisonChartProps {
  customBuildCosts: CustomBuildCosts;
  appmixerCosts: AppmixerCosts;
  currency: Currency;
}

export function CostComparisonChart({
  customBuildCosts,
  appmixerCosts,
  currency,
}: CostComparisonChartProps) {
  const data = [
    {
      name: "Year 1",
      "Custom Build": customBuildCosts.yearlyBreakdown.year1,
      Appmixer: appmixerCosts.yearlyBreakdown.year1,
    },
    {
      name: "Year 2",
      "Custom Build": customBuildCosts.yearlyBreakdown.year2,
      Appmixer: appmixerCosts.yearlyBreakdown.year2,
    },
    {
      name: "Year 3",
      "Custom Build": customBuildCosts.yearlyBreakdown.year3,
      Appmixer: appmixerCosts.yearlyBreakdown.year3,
    },
  ];

  const formatTooltip = (value: number) => formatCurrency(value, currency);
  const formatYAxis = (value: number) =>
    formatCurrency(value, currency, { compact: true });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Comparison</CardTitle>
        <CardDescription>Annual costs: Custom Build vs. Appmixer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-sm" />
              <YAxis tickFormatter={formatYAxis} className="text-sm" />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="Custom Build" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Appmixer" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Custom Build Total</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(customBuildCosts.yearlyBreakdown.total, currency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Appmixer Total</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(appmixerCosts.yearlyBreakdown.total, currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
