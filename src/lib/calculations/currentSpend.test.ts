import { describe, it, expect } from "vitest";
import { calculateCurrentSpendComparison } from "./currentSpend";
import { defaultCalculatorInputs } from "@/types/calculator";
import { calculateAppmixerCosts } from "./appmixerCosts";

describe("calculateCurrentSpendComparison", () => {
  const baseInputs = defaultCalculatorInputs;
  const appmixerCosts = calculateAppmixerCosts(baseInputs);

  it("returns hasCurrentSpend: false when spend is 0", () => {
    const result = calculateCurrentSpendComparison(baseInputs, appmixerCosts);
    expect(result.hasCurrentSpend).toBe(false);
    expect(result.currentAnnualSpend).toBe(0);
  });

  it("returns hasCurrentSpend: true when spend > 0", () => {
    const inputs = {
      ...baseInputs,
      currentCosts: { ...baseInputs.currentCosts, currentIntegrationSpend: 120000 },
    };
    const result = calculateCurrentSpendComparison(inputs, appmixerCosts);
    expect(result.hasCurrentSpend).toBe(true);
    expect(result.currentAnnualSpend).toBe(120000);
  });

  it("calculates annual savings correctly", () => {
    const inputs = {
      ...baseInputs,
      currentCosts: { ...baseInputs.currentCosts, currentIntegrationSpend: 120000 },
    };
    const result = calculateCurrentSpendComparison(inputs, appmixerCosts);
    const expectedAnnual =
      appmixerCosts.platformSubscription + appmixerCosts.ongoingManagement;
    expect(result.appmixerAnnualCost).toBe(expectedAnnual);
    expect(result.annualSavings).toBe(120000 - expectedAnnual);
  });

  it("calculates savings percentage correctly", () => {
    const inputs = {
      ...baseInputs,
      currentCosts: { ...baseInputs.currentCosts, currentIntegrationSpend: 100000 },
    };
    const result = calculateCurrentSpendComparison(inputs, appmixerCosts);
    const expected = Math.round(
      ((100000 - result.appmixerAnnualCost) / 100000) * 100
    );
    expect(result.savingsPercentage).toBe(expected);
  });

  it("returns 0 savings percentage when spend is 0", () => {
    const result = calculateCurrentSpendComparison(baseInputs, appmixerCosts);
    expect(result.savingsPercentage).toBe(0);
  });

  it("handles case where Appmixer costs more than current spend", () => {
    const inputs = {
      ...baseInputs,
      currentCosts: { ...baseInputs.currentCosts, currentIntegrationSpend: 100 },
    };
    const result = calculateCurrentSpendComparison(inputs, appmixerCosts);
    expect(result.hasCurrentSpend).toBe(true);
    expect(result.annualSavings).toBeLessThan(0);
    expect(result.savingsPercentage).toBeLessThan(0);
  });

  it("calculates 3-year comparison correctly", () => {
    const inputs = {
      ...baseInputs,
      currentCosts: { ...baseInputs.currentCosts, currentIntegrationSpend: 120000 },
    };
    const result = calculateCurrentSpendComparison(inputs, appmixerCosts);
    expect(result.threeYearCurrentSpend).toBe(360000);
    expect(result.threeYearAppmixerCost).toBe(appmixerCosts.yearlyBreakdown.total);
    expect(result.threeYearSavings).toBe(360000 - appmixerCosts.yearlyBreakdown.total);
  });
});
