export type CompanySize = "smb" | "mid-market" | "enterprise";

export type IndustryVertical =
  | "saas"
  | "fintech"
  | "healthtech"
  | "ecommerce"
  | "logistics"
  | "manufacturing"
  | "other";

export type IntegrationApproach = "custom-code" | "other-ipaas" | "none";

export type IntegrationComplexity = "simple" | "medium" | "complex";

export type Currency = "USD" | "EUR" | "GBP";

export interface CompanyProfileInputs {
  companySize: CompanySize;
  industryVertical: IndustryVertical;
  numberOfDevelopers: number;
  developerHourlyCost: number;
  currentIntegrationApproach: IntegrationApproach;
}

export interface IntegrationRequirementsInputs {
  numberOfIntegrations: number;
  integrationComplexity: IntegrationComplexity;
  endUserFacing: boolean;
  expectedMonthlyApiCalls: number;
  selfHostedRequired: boolean;
  appmixerMonthlyCost: number;
}

export interface CurrentCostsInputs {
  currentIntegrationSpend: number;
  devHoursOnIntegrationPerMonth: number;
  integrationIncidentsPerMonth: number;
}

export interface CalculatorInputs {
  companyProfile: CompanyProfileInputs;
  integrationRequirements: IntegrationRequirementsInputs;
  currentCosts: CurrentCostsInputs;
  currency: Currency;
}

export const defaultCompanyProfile: CompanyProfileInputs = {
  companySize: "mid-market",
  industryVertical: "saas",
  numberOfDevelopers: 5,
  developerHourlyCost: 75,
  currentIntegrationApproach: "custom-code",
};

export const defaultIntegrationRequirements: IntegrationRequirementsInputs = {
  numberOfIntegrations: 5,
  integrationComplexity: "medium",
  endUserFacing: true,
  expectedMonthlyApiCalls: 100000,
  selfHostedRequired: false,
  appmixerMonthlyCost: 999,
};

export const defaultCurrentCosts: CurrentCostsInputs = {
  currentIntegrationSpend: 0,
  devHoursOnIntegrationPerMonth: 20,
  integrationIncidentsPerMonth: 3,
};

export const defaultCalculatorInputs: CalculatorInputs = {
  companyProfile: defaultCompanyProfile,
  integrationRequirements: defaultIntegrationRequirements,
  currentCosts: defaultCurrentCosts,
  currency: "USD",
};
