import type { CustomBuildCosts, AppmixerCosts, BenefitBreakdown, ROIMetrics, MonthlyDataPoint } from "@/types/results";

const DISCOUNT_RATE = 0.10; // 10% discount rate for NPV calculation

export function calculateROIMetrics(
  customBuildCosts: CustomBuildCosts,
  appmixerCosts: AppmixerCosts,
  benefits: BenefitBreakdown
): ROIMetrics {
  const customBuildTotal = customBuildCosts.yearlyBreakdown.total;
  const appmixerTotal = appmixerCosts.yearlyBreakdown.total;

  // 3-Year Savings = Cost avoided + Benefits gained
  // Benefits are annual values, multiply by 3 for 3-year total
  const threeYearBenefits = benefits.total * 3;
  const threeYearSavings = (customBuildTotal - appmixerTotal) + threeYearBenefits;

  // ROI Percentage: Total Value (savings + benefits) / Appmixer Cost × 100
  const roiPercentage = (threeYearSavings / appmixerTotal) * 100;

  // Monthly savings for payback calculation (including benefits)
  const monthlySavings = threeYearSavings / 36;

  // Payback Period (Months): Total Appmixer Investment / Monthly Savings
  const totalAppmixerInvestment =
    appmixerCosts.implementationCost + appmixerCosts.platformSubscription;
  const paybackPeriodMonths =
    monthlySavings > 0 ? totalAppmixerInvestment / monthlySavings : 0;

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
  // Calculate annual savings (cost savings + annual benefits)
  const annualBenefits = benefits.total;
  const year1Savings =
    customBuildCosts.yearlyBreakdown.year1 - appmixerCosts.yearlyBreakdown.year1 + annualBenefits;
  const year2Savings =
    customBuildCosts.yearlyBreakdown.year2 - appmixerCosts.yearlyBreakdown.year2 + annualBenefits;
  const year3Savings =
    customBuildCosts.yearlyBreakdown.year3 - appmixerCosts.yearlyBreakdown.year3 + annualBenefits;

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

  // Monthly benefits (annual benefits / 12)
  const monthlyBenefits = benefits ? benefits.total / 12 : 0;

  let customCumulative = 0;
  let appmixerCumulative = 0;
  let benefitsCumulative = 0;

  for (let month = 1; month <= 36; month++) {
    const yearKey = month <= 12 ? "year1" : month <= 24 ? "year2" : "year3";

    customCumulative += customMonthly[yearKey];
    appmixerCumulative += appmixerMonthly[yearKey];
    benefitsCumulative += monthlyBenefits;

    projection.push({
      month,
      customBuildCumulative: Math.round(customCumulative),
      appmixerCumulative: Math.round(appmixerCumulative),
      savings: Math.round(customCumulative - appmixerCumulative + benefitsCumulative),
    });
  }

  return projection;
}
