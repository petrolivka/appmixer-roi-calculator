"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { MonthlyDataPoint } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { chartReveal } from "@/lib/animations";

interface BreakEvenChartProps {
  monthlyProjection: MonthlyDataPoint[];
  breakEvenMonth: number;
  currency: Currency;
}

export function BreakEvenChart({
  monthlyProjection,
  breakEvenMonth,
  currency,
}: BreakEvenChartProps) {
  const formatTooltip = (value: number) => formatCurrency(value, currency);
  const formatYAxis = (value: number) =>
    formatCurrency(value, currency, { compact: true });

  // Sample every 3 months for cleaner chart, always include break-even month
  const sampledData = monthlyProjection.filter(
    (point, index) =>
      index % 3 === 0 ||
      index === monthlyProjection.length - 1 ||
      point.month === breakEvenMonth
  );

  return (
    <motion.div
      className="h-full"
      variants={chartReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle>Break-Even Timeline</CardTitle>
          <CardDescription>
            Cumulative costs over 36 months — break-even at month {breakEvenMonth}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sampledData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m) => `M${m}`}
                  className="text-sm"
                />
                <YAxis tickFormatter={formatYAxis} className="text-sm" />
                <Tooltip
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Month ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <ReferenceLine
                  x={breakEvenMonth}
                  stroke="hsl(var(--chart-2))"
                  strokeDasharray="5 5"
                  label={{
                    value: "Break-even",
                    position: "top",
                    fill: "hsl(var(--chart-2))",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="customBuildCumulative"
                  name="Custom Build"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="appmixerCumulative"
                  name="Appmixer"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
