import type { CalculatorInputs } from "@/types/calculator";
import type { BenefitBreakdown } from "@/types/results";
import { BENCHMARKS, SELF_HOSTED_BENEFITS } from "@/lib/constants/benchmarks";

/**
 * Calculate benefits from using Appmixer.
 * 
 * IMPORTANT: This function returns ONLY incremental benefits that are NOT already
 * captured in the cost comparison between custom build and Appmixer.
 * 
 * Benefits already captured in cost comparison (NOT included here):
 * - Development time savings → reflected in lower implementationCost
 * - Maintenance reduction → reflected in lower ongoingManagement
 * 
 * Benefits returned here are ADDITIONAL value beyond cost savings:
 * - ONE-TIME: timeToMarketValue (faster launch = earlier revenue)
 * - ANNUAL: errorReduction, churnReduction, dealWinRateImprovement, compliance
 */
export function calculateBenefits(inputs: CalculatorInputs): BenefitBreakdown {
  const { integrationRequirements, companyProfile, currentCosts } = inputs;
  const { endUserFacing } = integrationRequirements;
  const { companySize } = companyProfile;
  const { integrationIncidentsPerMonth } = currentCosts;

  // Development time savings: REMOVED - already captured in cost comparison
  // (Custom build initialDevelopment vs Appmixer implementationCost)
  const developmentTimeSavings = 0;

  // Maintenance reduction: REMOVED - already captured in cost comparison
  // (Custom build developerOpportunityCost vs Appmixer ongoingManagement)
  const maintenanceReduction = 0;

  // Time-to-market value: ONE-TIME benefit (not multiplied by years)
  // Conservative estimate: 1 month faster × reduced monthly revenue impact
  // This captures earlier revenue, not captured in cost comparison
  const monthsSavedMap = { simple: 0.5, medium: 1, complex: 2 };
  const monthsSaved = monthsSavedMap[integrationRequirements.integrationComplexity];
  const revenueImpactMultiplier =
    companySize === "enterprise" ? 3 : companySize === "mid-market" ? 1.5 : 1;
  // Reduced base impact from $10k to $5k for more realistic estimates
  const timeToMarketValue =
    monthsSaved * 5000 * revenueImpactMultiplier;

  // Error reduction: ANNUAL benefit
  // 95% auto-error handling - this is operational savings not in cost comparison
  const incidentsReduced = integrationIncidentsPerMonth * 12 * BENCHMARKS.errorHandlingAutomation;
  const errorReduction = incidentsReduced * BENCHMARKS.costPerIncident;

  // Churn reduction: ANNUAL benefit (conservative)
  // Only for end-user facing integrations
  // Reduced from 40% to 10% - more realistic attribution
  let churnReduction = 0;
  if (endUserFacing) {
    // Conservative churn cost estimates (reduced significantly)
    const estimatedChurnCost =
      companySize === "enterprise"
        ? 100000  // was 500000
        : companySize === "mid-market"
          ? 30000   // was 100000
          : 10000;  // was 25000
    // Reduced attribution from 40% to 10%
    churnReduction = estimatedChurnCost * 0.10;
  }

  // Deal win rate improvement: ANNUAL benefit (conservative)
  // Only for end-user facing integrations
  // Reduced from 20% to 5% - more realistic attribution
  let dealWinRateImprovement = 0;
  if (endUserFacing) {
    const estimatedDealValue =
      companySize === "enterprise"
        ? 50000   // was 100000
        : companySize === "mid-market"
          ? 15000   // was 25000
          : 3000;   // was 5000
    const estimatedDealsPerYear = companySize === "enterprise" ? 10 : companySize === "mid-market" ? 30 : 50;
    // Reduced attribution from 20% to 5%
    const additionalDeals = estimatedDealsPerYear * 0.05;
    dealWinRateImprovement = additionalDeals * estimatedDealValue;
  }

  // Compliance savings: ANNUAL benefit (self-hosted only)
  let complianceSavings = 0;
  let vendorLockInAvoidance = 0;
  if (integrationRequirements.selfHostedRequired) {
    complianceSavings =
      SELF_HOSTED_BENEFITS.complianceSavings[companyProfile.industryVertical] || 0;
    vendorLockInAvoidance = SELF_HOSTED_BENEFITS.vendorLockInAvoidance;
  }

  // Total is sum of all benefits
  // Note: timeToMarketValue is one-time, others are annual
  // The ROI calculation will handle the distinction
  const total =
    developmentTimeSavings +
    maintenanceReduction +
    timeToMarketValue +
    errorReduction +
    churnReduction +
    dealWinRateImprovement +
    complianceSavings +
    vendorLockInAvoidance;

  return {
    developmentTimeSavings,
    maintenanceReduction,
    timeToMarketValue,
    errorReduction,
    churnReduction,
    dealWinRateImprovement,
    complianceSavings,
    vendorLockInAvoidance,
    total,
  };
}
