import type { CalculatorInputs } from "@/types/calculator";
import type { CalculationResults } from "@/types/results";
import { calculateCustomBuildCosts } from "./buildCosts";
import { calculateAppmixerCosts } from "./appmixerCosts";
import { calculateBenefits } from "./benefits";
import { calculateROIMetrics, generateMonthlyProjection } from "./roi";

export function calculateROI(inputs: CalculatorInputs): CalculationResults {
  const customBuildCosts = calculateCustomBuildCosts(inputs);
  const appmixerCosts = calculateAppmixerCosts(inputs);
  const benefits = calculateBenefits(inputs);
  const roiMetrics = calculateROIMetrics(customBuildCosts, appmixerCosts);
  const monthlyProjection = generateMonthlyProjection(customBuildCosts, appmixerCosts);

  return {
    customBuildCosts,
    appmixerCosts,
    benefits,
    roiMetrics,
    monthlyProjection,
  };
}

export { calculateCustomBuildCosts } from "./buildCosts";
export { calculateAppmixerCosts } from "./appmixerCosts";
export { calculateBenefits } from "./benefits";
export { calculateROIMetrics, generateMonthlyProjection } from "./roi";
