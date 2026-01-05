import type { CalculatorInputs } from "@/types/calculator";
import type { BenefitBreakdown } from "@/types/results";
import { BENCHMARKS, COMPLEXITY_MULTIPLIERS, BASE_INTEGRATION_COST } from "@/lib/constants/benchmarks";

export function calculateBenefits(inputs: CalculatorInputs): BenefitBreakdown {
  const { integrationRequirements, companyProfile, currentCosts } = inputs;
  const { numberOfIntegrations, integrationComplexity, endUserFacing } = integrationRequirements;
  const { developerHourlyCost, companySize } = companyProfile;
  const { devHoursOnIntegrationPerMonth, integrationIncidentsPerMonth } = currentCosts;

  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[integrationComplexity];

  // 1. Development time savings: Hours saved × hourly rate
  // 64% faster integration builds
  const customBuildHours =
    (numberOfIntegrations * complexityMultiplier * BASE_INTEGRATION_COST) /
    developerHourlyCost;
  const hoursSaved = customBuildHours * BENCHMARKS.devTimeSavingsPercent;
  const developmentTimeSavings = hoursSaved * developerHourlyCost;

  // 2. Maintenance reduction: 60-80% reduction (using 70%)
  const currentMaintenanceCost = devHoursOnIntegrationPerMonth * developerHourlyCost * 12;
  const maintenanceReduction = currentMaintenanceCost * BENCHMARKS.maintenanceReductionPercent;

  // 3. Time-to-market value: Months saved × monthly revenue impact
  // Estimate months saved based on complexity
  const monthsSavedMap = { simple: 1, medium: 2, complex: 4 };
  const monthsSaved = monthsSavedMap[integrationComplexity];
  const revenueImpactMultiplier =
    companySize === "enterprise" ? 5 : companySize === "mid-market" ? 2 : 1;
  const timeToMarketValue =
    monthsSaved * BENCHMARKS.monthlyRevenueImpact * revenueImpactMultiplier;

  // 4. Error reduction: Incidents reduced × cost per incident
  // 95% auto-error handling
  const incidentsReduced = integrationIncidentsPerMonth * 12 * BENCHMARKS.errorHandlingAutomation;
  const errorReduction = incidentsReduced * BENCHMARKS.costPerIncident;

  // 5. Churn reduction: Only applicable for end-user facing integrations
  // 40% churn reduction - simplified calculation based on company size
  let churnReduction = 0;
  if (endUserFacing) {
    const estimatedChurnCost =
      companySize === "enterprise"
        ? 500000
        : companySize === "mid-market"
          ? 100000
          : 25000;
    churnReduction = estimatedChurnCost * BENCHMARKS.churnReductionPercent;
  }

  // 6. Deal win rate improvement: Only for end-user facing integrations
  // 20% more deals won
  let dealWinRateImprovement = 0;
  if (endUserFacing) {
    const estimatedDealValue =
      companySize === "enterprise"
        ? 100000
        : companySize === "mid-market"
          ? 25000
          : 5000;
    const estimatedDealsPerYear = companySize === "enterprise" ? 20 : companySize === "mid-market" ? 50 : 100;
    const additionalDeals = estimatedDealsPerYear * BENCHMARKS.dealWinRateImprovement;
    dealWinRateImprovement = additionalDeals * estimatedDealValue;
  }

  const total =
    developmentTimeSavings +
    maintenanceReduction +
    timeToMarketValue +
    errorReduction +
    churnReduction +
    dealWinRateImprovement;

  return {
    developmentTimeSavings,
    maintenanceReduction,
    timeToMarketValue,
    errorReduction,
    churnReduction,
    dealWinRateImprovement,
    total,
  };
}
