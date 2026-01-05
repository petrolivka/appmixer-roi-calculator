// Industry benchmarks sourced from Nucleus Research, Informatica, Gartner

export const BENCHMARKS = {
  // Average iPaaS ROI from industry studies
  averageIpaasRoi: 413,

  // Average payback period in months
  averagePaybackMonths: 4,

  // Average annual benefit for enterprise
  averageAnnualBenefit: 2201369,

  // Integration build speed improvement
  integrationSpeedImprovement: 0.64, // 64% faster

  // Time-to-market acceleration multiplier
  timeToMarketAcceleration: 12, // 12x faster

  // Development time savings with iPaaS
  devTimeSavingsPercent: 0.64, // 64% reduction

  // Maintenance reduction with iPaaS
  maintenanceReductionPercent: 0.70, // 60-80%, using 70%

  // Error handling automation
  errorHandlingAutomation: 0.95, // 95% auto-error handling

  // Churn reduction potential
  churnReductionPercent: 0.40, // 40% churn reduction

  // Deal win rate improvement
  dealWinRateImprovement: 0.20, // 20% more deals won

  // Cost per integration incident
  costPerIncident: 500,

  // Monthly revenue impact per month of faster time-to-market
  monthlyRevenueImpact: 10000,
} as const;

export const COMPLEXITY_MULTIPLIERS = {
  simple: 0.5,
  medium: 1.0,
  complex: 2.0,
} as const;

export const BASE_INTEGRATION_COST = 15000; // Base cost per integration for custom build

export const MAINTENANCE_RATE = 0.25; // 25% of initial cost annually

export const INFRASTRUCTURE_COSTS = {
  low: 500, // < 50k API calls/month
  medium: 1000, // 50k - 500k API calls/month
  high: 2000, // > 500k API calls/month
} as const;
