import type { CalculatorInputs } from "@/types/calculator";
import type { CustomBuildCosts, YearlyCosts } from "@/types/results";
import {
  COMPLEXITY_MULTIPLIERS,
  BASE_INTEGRATION_COST,
  MAINTENANCE_RATE,
  INFRASTRUCTURE_COSTS,
} from "@/lib/constants/benchmarks";

function getInfrastructureMonthlyCost(apiCalls: number): number {
  if (apiCalls <= 50000) return INFRASTRUCTURE_COSTS.low;
  if (apiCalls <= 500000) return INFRASTRUCTURE_COSTS.medium;
  return INFRASTRUCTURE_COSTS.high;
}

export function calculateCustomBuildCosts(inputs: CalculatorInputs): CustomBuildCosts {
  const { integrationRequirements, companyProfile, currentCosts } = inputs;
  const { numberOfIntegrations, integrationComplexity, expectedMonthlyApiCalls } =
    integrationRequirements;
  const { developerHourlyCost, numberOfDevelopers } = companyProfile;
  const { devHoursOnIntegrationPerMonth } = currentCosts;

  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[integrationComplexity];

  // Initial development cost: integrations × complexity_factor × $15,000
  const initialDevelopment =
    numberOfIntegrations * complexityMultiplier * BASE_INTEGRATION_COST;

  // Annual maintenance: initial_cost × 25%
  const annualMaintenance = initialDevelopment * MAINTENANCE_RATE;

  // Infrastructure costs: $500-2,000/month based on volume
  const monthlyInfrastructure = getInfrastructureMonthlyCost(expectedMonthlyApiCalls);
  const infrastructureCosts = monthlyInfrastructure * 12; // Annual

  // Developer opportunity cost: dev_hours × number_of_devs × hourly_rate × 12 months
  const developerOpportunityCost =
    devHoursOnIntegrationPerMonth * numberOfDevelopers * developerHourlyCost * 12;

  // Yearly breakdown
  // Year 1: Initial development + first year maintenance + infrastructure + dev time
  const year1 =
    initialDevelopment + annualMaintenance + infrastructureCosts + developerOpportunityCost;

  // Year 2 & 3: Maintenance + infrastructure + dev time (no initial development)
  const year2 = annualMaintenance + infrastructureCosts + developerOpportunityCost;
  const year3 = annualMaintenance + infrastructureCosts + developerOpportunityCost;

  const total = year1 + year2 + year3;

  const yearlyBreakdown: YearlyCosts = {
    year1,
    year2,
    year3,
    total,
  };

  return {
    initialDevelopment,
    annualMaintenance,
    infrastructureCosts,
    developerOpportunityCost,
    yearlyBreakdown,
  };
}
