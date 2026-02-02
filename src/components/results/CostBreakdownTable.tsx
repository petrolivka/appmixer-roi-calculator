"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomBuildCosts, AppmixerCosts, CurrentSpendComparison } from "@/types/results";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/currency";
import { chartReveal } from "@/lib/animations";

interface CostBreakdownTableProps {
  customBuildCosts: CustomBuildCosts;
  appmixerCosts: AppmixerCosts;
  currency: Currency;
  currentSpendComparison?: CurrentSpendComparison;
}

export function CostBreakdownTable({
  customBuildCosts,
  appmixerCosts,
  currency,
  currentSpendComparison,
}: CostBreakdownTableProps) {
  const fmt = (value: number) => formatCurrency(value, currency);
  const showCurrentSpend = currentSpendComparison?.hasCurrentSpend ?? false;

  return (
    <motion.div
      variants={chartReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Detailed Cost Breakdown</CardTitle>
          <CardDescription>
            Line-by-line comparison of all cost components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-6 ${showCurrentSpend ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            {/* Current Spend (if provided) */}
            {showCurrentSpend && currentSpendComparison && (
              <div>
                <h4 className="font-semibold mb-3 text-orange-600">Your Current Spend</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Annual Integration Spend</TableCell>
                      <TableCell className="text-right">
                        {fmt(currentSpendComparison.currentAnnualSpend)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">&mdash;</TableCell>
                      <TableCell className="text-right text-muted-foreground">&mdash;</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">&mdash;</TableCell>
                      <TableCell className="text-right text-muted-foreground">&mdash;</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-muted-foreground">&mdash;</TableCell>
                      <TableCell className="text-right text-muted-foreground">&mdash;</TableCell>
                    </TableRow>
                    <TableRow className="font-bold border-t-2">
                      <TableCell>Total (3 Years)</TableCell>
                      <TableCell className="text-right text-orange-600">
                        {fmt(currentSpendComparison.threeYearCurrentSpend)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Custom Build Costs */}
            <div>
              <h4 className="font-semibold mb-3 text-red-600">Custom Build Costs</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Initial Development</TableCell>
                    <TableCell className="text-right">
                      {fmt(customBuildCosts.initialDevelopment)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Annual Maintenance (x3)</TableCell>
                    <TableCell className="text-right">
                      {fmt(customBuildCosts.annualMaintenance * 3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Infrastructure (3yr)</TableCell>
                    <TableCell className="text-right">
                      {fmt(customBuildCosts.infrastructureCosts * 3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Developer Time (3yr)</TableCell>
                    <TableCell className="text-right">
                      {fmt(customBuildCosts.developerOpportunityCost * 3)}
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t-2">
                    <TableCell>Total (3 Years)</TableCell>
                    <TableCell className="text-right text-red-600">
                      {fmt(customBuildCosts.yearlyBreakdown.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Appmixer Costs */}
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Appmixer Costs</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Implementation</TableCell>
                    <TableCell className="text-right">
                      {fmt(appmixerCosts.implementationCost)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Platform Subscription (3yr)</TableCell>
                    <TableCell className="text-right">
                      {fmt(appmixerCosts.platformSubscription * 3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ongoing Management (3yr)</TableCell>
                    <TableCell className="text-right">
                      {fmt(appmixerCosts.ongoingManagement * 3)}
                    </TableCell>
                  </TableRow>
                  {appmixerCosts.selfHostedInfrastructure > 0 ? (
                    <TableRow>
                      <TableCell>Self-Hosted Infrastructure (3yr)</TableCell>
                      <TableCell className="text-right">
                        {fmt(appmixerCosts.selfHostedInfrastructure * 3)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell className="text-muted-foreground">&mdash;</TableCell>
                      <TableCell className="text-right text-muted-foreground">&mdash;</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="font-bold border-t-2">
                    <TableCell>Total (3 Years)</TableCell>
                    <TableCell className="text-right text-blue-600">
                      {fmt(appmixerCosts.yearlyBreakdown.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Savings Summary */}
          <div className="mt-6 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-800 dark:text-green-300">Your 3-Year Savings</span>
              <span className="text-2xl font-bold text-green-600">
                {fmt(customBuildCosts.yearlyBreakdown.total - appmixerCosts.yearlyBreakdown.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
