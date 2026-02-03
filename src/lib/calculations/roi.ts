import type { CustomBuildCosts, AppmixerCosts, BenefitBreakdown, ROIMetrics, MonthlyDataPoint } from "@/types/results";

const DISCOUNT_RATE = 0.10; // 10% discount rate for NPV calculation

/**
 * Separate one-time benefits from annual benefits.
 * - One-time: timeToMarketValue (realized once at launch)
 * - Annual: errorReduction, churnReduction, dealWinRateImprovement, compliance, vendorLockIn
 * - Zero (already in costs): developmentTimeSavings, maintenanceReduction
 */
function separateBenefits(benefits: BenefitBreakdown): { oneTime: number; annual: number } {
  const oneTime = benefits.timeToMarketValue;
  const annual =
    benefits.errorReduction +
    benefits.churnReduction +
    benefits.dealWinRateImprovement +
    benefits.complianceSavings +
    benefits.vendorLockInAvoidance;
  // developmentTimeSavings and maintenanceReduction should be 0 (captured in costs)
  return { oneTime, annual };
}

export function calculateROIMetrics(
  customBuildCosts: CustomBuildCosts,
  appmixerCosts: AppmixerCosts,
  benefits: BenefitBreakdown
): ROIMetrics {
  const customBuildTotal = customBuildCosts.yearlyBreakdown.total;
  const appmixerTotal = appmixerCosts.yearlyBreakdown.total;

  // Separate one-time and annual benefits
  const { oneTime, annual } = separateBenefits(benefits);

  // 3-Year Savings = Cost avoided + One-time benefits + (Annual benefits × 3)
  const threeYearBenefits = oneTime + (annual * 3);
  const threeYearSavings = (customBuildTotal - appmixerTotal) + threeYearBenefits;

  // ROI Percentage: Total Value (savings + benefits) / Appmixer Cost × 100
  const roiPercentage = (threeYearSavings / appmixerTotal) * 100;

  // Monthly savings for payback calculation
  // One-time benefits are realized in month 1, annual benefits spread monthly
  const monthlyAnnualBenefits = annual / 12;
  const monthlyCostSavings = (customBuildTotal - appmixerTotal) / 36;
  const avgMonthlySavings = monthlyCostSavings + monthlyAnnualBenefits;

  // Payback Period (Months): Total Appmixer Investment / Monthly Savings
  const totalAppmixerInvestment =
    appmixerCosts.implementationCost + appmixerCosts.platformSubscription;
  // Subtract one-time benefit from investment since it's realized immediately
  const netInvestment = Math.max(0, totalAppmixerInvestment - oneTime);
  const paybackPeriodMonths =
    avgMonthlySavings > 0 ? netInvestment / avgMonthlySavings : 0;

  // Net Present Value at 10% discount rate
  const npv = calculateNPV(customBuildCosts, appmixerCosts, benefits, DISCOUNT_RATE);

  // Break-even month (when cumulative savings exceed cumulative Appmixer costs)
  const breakEvenMonth = calculateBreakEvenMonth(customBuildCosts, appmixerCosts, benefits);

  return {
    roiPercentage: Math.round(roiPercentage),
    paybackPeriodMonths: Math.round(paybackPeriodMonths * 10) / 10,
    threeYearSavings: Math.round(threeYearSavings),
    netPresentValue: Math.round(npv),
    breakEvenMonth,
  };
}

function calculateNPV(
  customBuildCosts: CustomBuildCosts,
  appmixerCosts: AppmixerCosts,
  benefits: BenefitBreakdown,
  discountRate: number
): number {
  const { oneTime, annual } = separateBenefits(benefits);
  
  // Year 1: cost savings + one-time benefit + annual benefits
  // Year 2-3: cost savings + annual benefits only
  const year1Savings =
    customBuildCosts.yearlyBreakdown.year1 - appmixerCosts.yearlyBreakdown.year1 + oneTime + annual;
  const year2Savings =
    customBuildCosts.yearlyBreakdown.year2 - appmixerCosts.yearlyBreakdown.year2 + annual;
  const year3Savings =
    customBuildCosts.yearlyBreakdown.year3 - appmixerCosts.yearlyBreakdown.year3 + annual;

  // NPV = Σ (Cash Flow / (1 + r)^t)
  const npv =
    year1Savings / Math.pow(1 + discountRate, 1) +
    year2Savings / Math.pow(1 + discountRate, 2) +
    year3Savings / Math.pow(1 + discountRate, 3);

  return npv;
}

function calculateBreakEvenMonth(
  customBuildCosts: CustomBuildCosts,
  appmixerCosts: AppmixerCosts,
  benefits: BenefitBreakdown
): number {
  const monthlyProjection = generateMonthlyProjection(customBuildCosts, appmixerCosts, benefits);

  // Break-even is when cumulative savings cover the total Appmixer investment
  // (implementation cost + annual platform subscription)
  const appmixerInvestment =
    appmixerCosts.implementationCost + appmixerCosts.platformSubscription;

  for (const point of monthlyProjection) {
    if (point.savings >= appmixerInvestment) {
      return point.month;
    }
  }

  return 36; // Default to end of 3 years if no break-even found
}

export function generateMonthlyProjection(
  customBuildCosts: CustomBuildCosts,
  appmixerCosts: AppmixerCosts,
  benefits?: BenefitBreakdown
): MonthlyDataPoint[] {
  const projection: MonthlyDataPoint[] = [];

  // Calculate monthly costs for each year
  const customMonthly = {
    year1: customBuildCosts.yearlyBreakdown.year1 / 12,
    year2: customBuildCosts.yearlyBreakdown.year2 / 12,
    year3: customBuildCosts.yearlyBreakdown.year3 / 12,
  };

  const appmixerMonthly = {
    year1: appmixerCosts.yearlyBreakdown.year1 / 12,
    year2: appmixerCosts.yearlyBreakdown.year2 / 12,
    year3: appmixerCosts.yearlyBreakdown.year3 / 12,
  };

  // Separate one-time and annual benefits
  let oneTimeBenefits = 0;
  let monthlyAnnualBenefits = 0;
  if (benefits) {
    const { oneTime, annual } = separateBenefits(benefits);
    oneTimeBenefits = oneTime;
    monthlyAnnualBenefits = annual / 12;
  }

  let customCumulative = 0;
  let appmixerCumulative = 0;
  let benefitsCumulative = 0;

  for (let month = 1; month <= 36; month++) {
    const yearKey = month <= 12 ? "year1" : month <= 24 ? "year2" : "year3";

    customCumulative += customMonthly[yearKey];
    appmixerCumulative += appmixerMonthly[yearKey];
    
    // One-time benefits realized in month 1, annual benefits spread monthly
    if (month === 1) {
      benefitsCumulative += oneTimeBenefits;
    }
    benefitsCumulative += monthlyAnnualBenefits;

    projection.push({
      month,
      customBuildCumulative: Math.round(customCumulative),
      appmixerCumulative: Math.round(appmixerCumulative),
      savings: Math.round(customCumulative - appmixerCumulative + benefitsCumulative),
    });
  }

  return projection;
}
