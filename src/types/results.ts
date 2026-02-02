export interface YearlyCosts {
  year1: number;
  year2: number;
  year3: number;
  total: number;
}

export interface CustomBuildCosts {
  initialDevelopment: number;
  annualMaintenance: number;
  infrastructureCosts: number;
  developerOpportunityCost: number;
  yearlyBreakdown: YearlyCosts;
}

export interface AppmixerCosts {
  platformSubscription: number;
  implementationCost: number;
  ongoingManagement: number;
  yearlyBreakdown: YearlyCosts;
}

export interface BenefitBreakdown {
  developmentTimeSavings: number;
  maintenanceReduction: number;
  timeToMarketValue: number;
  errorReduction: number;
  churnReduction: number;
  dealWinRateImprovement: number;
  total: number;
}

export interface ROIMetrics {
  roiPercentage: number;
  paybackPeriodMonths: number;
  threeYearSavings: number;
  netPresentValue: number;
  breakEvenMonth: number;
}

export interface MonthlyDataPoint {
  month: number;
  customBuildCumulative: number;
  appmixerCumulative: number;
  savings: number;
}

export interface CurrentSpendComparison {
  currentAnnualSpend: number;
  appmixerAnnualCost: number;
  annualSavings: number;
  savingsPercentage: number;
  threeYearCurrentSpend: number;
  threeYearAppmixerCost: number;
  threeYearSavings: number;
  hasCurrentSpend: boolean;
}

export interface CalculationResults {
  customBuildCosts: CustomBuildCosts;
  appmixerCosts: AppmixerCosts;
  benefits: BenefitBreakdown;
  roiMetrics: ROIMetrics;
  monthlyProjection: MonthlyDataPoint[];
  currentSpendComparison: CurrentSpendComparison;
}
