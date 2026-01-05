import type { CalculatorInputs } from "@/types/calculator";
import type { AppmixerCosts, YearlyCosts } from "@/types/results";
import { getMonthlyPlatformCost } from "@/lib/constants/pricing";
import {
  COMPLEXITY_MULTIPLIERS,
  BASE_INTEGRATION_COST,
} from "@/lib/constants/benchmarks";

// Appmixer implementation is ~85% faster than custom build (15% of custom build time)
const IMPLEMENTATION_TIME_FACTOR = 0.15;

export function calculateAppmixerCosts(inputs: CalculatorInputs): AppmixerCosts {
  const { integrationRequirements, companyProfile } = inputs;
  const {
    numberOfIntegrations,
    integrationComplexity,
    expectedMonthlyApiCalls,
    selfHostedRequired,
    endUserFacing,
  } = integrationRequirements;
  const { developerHourlyCost } = companyProfile;

  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[integrationComplexity];

  // Platform subscription: Based on pricing tier selection
  const monthlySubscription = getMonthlyPlatformCost(
    expectedMonthlyApiCalls,
    selfHostedRequired,
    endUserFacing
  );
  const platformSubscription = monthlySubscription * 12; // Annual

  // Implementation time: integrations × 0.15 × complexity_factor × $15,000
  // Converting cost to hours then back - simplified calculation
  const customBuildHours =
    (numberOfIntegrations * complexityMultiplier * BASE_INTEGRATION_COST) /
    developerHourlyCost;
  const appmixerImplementationHours = customBuildHours * IMPLEMENTATION_TIME_FACTOR;
  const implementationCost = appmixerImplementationHours * developerHourlyCost;

  // Ongoing management: Minimal - estimated at 10% of custom build maintenance time
  const customMaintenanceHours = 10 * numberOfIntegrations; // Roughly 10 hours per integration per year
  const appmixerMaintenanceHours = customMaintenanceHours * 0.1;
  const ongoingManagement = appmixerMaintenanceHours * developerHourlyCost;

  // Yearly breakdown
  // Year 1: Implementation + platform subscription + minimal management
  const year1 = implementationCost + platformSubscription + ongoingManagement;

  // Year 2 & 3: Platform subscription + minimal management
  const year2 = platformSubscription + ongoingManagement;
  const year3 = platformSubscription + ongoingManagement;

  const total = year1 + year2 + year3;

  const yearlyBreakdown: YearlyCosts = {
    year1,
    year2,
    year3,
    total,
  };

  return {
    platformSubscription,
    implementationCost,
    ongoingManagement,
    yearlyBreakdown,
  };
}
