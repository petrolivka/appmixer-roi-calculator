import type { CalculatorInputs } from "@/types/calculator";
import type { AppmixerCosts, YearlyCosts } from "@/types/results";
import {
  COMPLEXITY_MULTIPLIERS,
  BASE_INTEGRATION_COST,
  SELF_HOSTED_COSTS,
} from "@/lib/constants/benchmarks";

// Appmixer implementation is ~85% faster than custom build (15% of custom build time)
const IMPLEMENTATION_TIME_FACTOR = 0.15;

export function calculateAppmixerCosts(inputs: CalculatorInputs): AppmixerCosts {
  const { integrationRequirements, companyProfile } = inputs;
  const {
    numberOfIntegrations,
    integrationComplexity,
    appmixerMonthlyCost,
    selfHostedRequired,
  } = integrationRequirements;
  const { developerHourlyCost, companySize } = companyProfile;

  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[integrationComplexity];

  // Platform subscription: User-provided monthly cost
  const monthlySubscription = appmixerMonthlyCost;
  const platformSubscription = monthlySubscription * 12; // Annual

  // Implementation time: integrations × 0.15 × complexity_factor × $15,000
  const customBuildHours =
    (numberOfIntegrations * complexityMultiplier * BASE_INTEGRATION_COST) /
    developerHourlyCost;
  const appmixerImplementationHours = customBuildHours * IMPLEMENTATION_TIME_FACTOR;
  let implementationCost = appmixerImplementationHours * developerHourlyCost;

  // Ongoing management: Minimal - estimated at 10% of custom build maintenance time
  const customMaintenanceHours = 10 * numberOfIntegrations;
  const appmixerMaintenanceHours = customMaintenanceHours * 0.1;
  let ongoingManagement = appmixerMaintenanceHours * developerHourlyCost;

  // Self-hosted adjustments
  let selfHostedInfrastructure = 0;
  if (selfHostedRequired) {
    // Additional implementation effort for self-hosted setup
    implementationCost *= SELF_HOSTED_COSTS.setupMultiplier;

    // Monthly infrastructure cost based on company size
    selfHostedInfrastructure =
      SELF_HOSTED_COSTS.monthlyInfrastructure[companySize] * 12;

    // More management overhead for self-hosted
    ongoingManagement *= SELF_HOSTED_COSTS.managementMultiplier;
  }

  // Yearly breakdown
  const year1 =
    implementationCost + platformSubscription + ongoingManagement + selfHostedInfrastructure;
  const year2 = platformSubscription + ongoingManagement + selfHostedInfrastructure;
  const year3 = platformSubscription + ongoingManagement + selfHostedInfrastructure;

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
    selfHostedInfrastructure,
    yearlyBreakdown,
  };
}
