import type { CompanySize, CalculatorInputs } from "@/types/calculator";

type QuickDefaults = Record<CompanySize, Omit<CalculatorInputs, "companyProfile"> & {
  companyProfile: Omit<CalculatorInputs["companyProfile"], "companySize">;
}>;

const QUICK_DEFAULTS: QuickDefaults = {
  smb: {
    companyProfile: {
      industryVertical: "saas",
      numberOfDevelopers: 5,
      developerHourlyCost: 60,
      currentIntegrationApproach: "custom-code",
    },
    integrationRequirements: {
      numberOfIntegrations: 10,
      integrationComplexity: "medium",
      endUserFacing: true,
      expectedMonthlyApiCalls: 50000,
      selfHostedRequired: false,
      appmixerMonthlyCost: 499,
    },
    currentCosts: {
      currentIntegrationSpend: 0,
      devHoursOnIntegrationPerMonth: 20,
      integrationIncidentsPerMonth: 3,
    },
    currency: "USD",
  },
  "mid-market": {
    companyProfile: {
      industryVertical: "saas",
      numberOfDevelopers: 10,
      developerHourlyCost: 80,
      currentIntegrationApproach: "custom-code",
    },
    integrationRequirements: {
      numberOfIntegrations: 10,
      integrationComplexity: "medium",
      endUserFacing: true,
      expectedMonthlyApiCalls: 100000,
      selfHostedRequired: false,
      appmixerMonthlyCost: 999,
    },
    currentCosts: {
      currentIntegrationSpend: 0,
      devHoursOnIntegrationPerMonth: 40,
      integrationIncidentsPerMonth: 5,
    },
    currency: "USD",
  },
  enterprise: {
    companyProfile: {
      industryVertical: "saas",
      numberOfDevelopers: 25,
      developerHourlyCost: 120,
      currentIntegrationApproach: "custom-code",
    },
    integrationRequirements: {
      numberOfIntegrations: 10,
      integrationComplexity: "medium",
      endUserFacing: true,
      expectedMonthlyApiCalls: 500000,
      selfHostedRequired: false,
      appmixerMonthlyCost: 2499,
    },
    currentCosts: {
      currentIntegrationSpend: 0,
      devHoursOnIntegrationPerMonth: 80,
      integrationIncidentsPerMonth: 10,
    },
    currency: "USD",
  },
};

export function buildQuickInputs(
  companySize: CompanySize,
  numberOfIntegrations: number,
  integrationComplexity: "simple" | "medium" | "complex"
): CalculatorInputs {
  const defaults = QUICK_DEFAULTS[companySize];
  return {
    companyProfile: {
      ...defaults.companyProfile,
      companySize,
    },
    integrationRequirements: {
      ...defaults.integrationRequirements,
      numberOfIntegrations,
      integrationComplexity,
    },
    currentCosts: defaults.currentCosts,
    currency: defaults.currency,
  };
}

export { QUICK_DEFAULTS };
