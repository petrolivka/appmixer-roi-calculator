import type { CalculationResults } from "@/types/results";
import type { CalculatorInputs } from "@/types/calculator";
import { formatCurrency } from "./currency";

export function generateEmailTemplate(
  inputs: CalculatorInputs,
  results: CalculationResults,
  url: string
): { subject: string; body: string } {
  const { roiMetrics } = results;
  const { currency } = inputs;
  const fmt = (v: number) => formatCurrency(v, currency);

  return {
    subject: `Integration Platform ROI Analysis — ${roiMetrics.roiPercentage}% projected ROI`,
    body: `Hi,

I ran an ROI analysis for adopting an integration platform (Appmixer) vs. our current approach. Here are the key findings:

KEY METRICS:
• Projected ROI: ${roiMetrics.roiPercentage}%
• 3-Year Savings: ${fmt(roiMetrics.threeYearSavings)}
• Payback Period: ${roiMetrics.paybackPeriodMonths.toFixed(1)} months
• Break-Even: Month ${roiMetrics.breakEvenMonth}

COST COMPARISON (3 Years):
• Custom Build: ${fmt(results.customBuildCosts.yearlyBreakdown.total)}
• Appmixer: ${fmt(results.appmixerCosts.yearlyBreakdown.total)}

Interactive results: ${url}

I think this is worth discussing. Let me know when you have time to review.

Best regards`,
  };
}

export function generateSlackMessage(
  inputs: CalculatorInputs,
  results: CalculationResults,
  url: string
): string {
  const { roiMetrics } = results;
  const { currency } = inputs;
  const fmt = (v: number) => formatCurrency(v, currency, { compact: true });

  return `📊 *Integration Platform ROI Analysis*

*${roiMetrics.roiPercentage}% ROI* | *${fmt(roiMetrics.threeYearSavings)} savings* (3yr) | *${roiMetrics.paybackPeriodMonths.toFixed(1)} mo* payback

Custom Build: ${fmt(results.customBuildCosts.yearlyBreakdown.total)} → Appmixer: ${fmt(results.appmixerCosts.yearlyBreakdown.total)}

<${url}|View interactive results>`;
}

export function generateSummaryText(
  inputs: CalculatorInputs,
  results: CalculationResults
): string {
  const { roiMetrics } = results;
  const { currency } = inputs;
  const fmt = (v: number) => formatCurrency(v, currency);

  return `ROI: ${roiMetrics.roiPercentage}% | Savings: ${fmt(roiMetrics.threeYearSavings)} (3yr) | Payback: ${roiMetrics.paybackPeriodMonths.toFixed(1)} months | Break-even: Month ${roiMetrics.breakEvenMonth}`;
}
