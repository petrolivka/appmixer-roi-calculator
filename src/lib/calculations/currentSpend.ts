import type { CalculatorInputs } from "@/types/calculator";
import type { AppmixerCosts, CurrentSpendComparison } from "@/types/results";

export function calculateCurrentSpendComparison(
  inputs: CalculatorInputs,
  appmixerCosts: AppmixerCosts
): CurrentSpendComparison {
  const { currentIntegrationSpend } = inputs.currentCosts;
  const hasCurrentSpend = currentIntegrationSpend > 0;

  // Appmixer annual cost = subscription + ongoing management
  const appmixerAnnualCost =
    appmixerCosts.platformSubscription + appmixerCosts.ongoingManagement;

  const annualSavings = currentIntegrationSpend - appmixerAnnualCost;
  const savingsPercentage =
    currentIntegrationSpend > 0
      ? (annualSavings / currentIntegrationSpend) * 100
      : 0;

  // 3-year comparison (current spend stays flat, Appmixer includes year1 implementation)
  const threeYearCurrentSpend = currentIntegrationSpend * 3;
  const threeYearAppmixerCost = appmixerCosts.yearlyBreakdown.total;
  const threeYearSavings = threeYearCurrentSpend - threeYearAppmixerCost;

  return {
    currentAnnualSpend: currentIntegrationSpend,
    appmixerAnnualCost,
    annualSavings,
    savingsPercentage: Math.round(savingsPercentage),
    threeYearCurrentSpend,
    threeYearAppmixerCost,
    threeYearSavings,
    hasCurrentSpend,
  };
}
