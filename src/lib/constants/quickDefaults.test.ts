import { describe, it, expect } from "vitest";
import { buildQuickInputs, QUICK_DEFAULTS } from "./quickDefaults";
import { calculateROI } from "@/lib/calculations";
import type { CompanySize, IntegrationComplexity } from "@/types/calculator";

describe("quickDefaults", () => {
  const sizes: CompanySize[] = ["smb", "mid-market", "enterprise"];
  const complexities: IntegrationComplexity[] = ["simple", "medium", "complex"];

  it("QUICK_DEFAULTS has entries for all company sizes", () => {
    for (const size of sizes) {
      expect(QUICK_DEFAULTS[size]).toBeDefined();
    }
  });

  it("buildQuickInputs returns valid CalculatorInputs for all combinations", () => {
    for (const size of sizes) {
      for (const complexity of complexities) {
        const inputs = buildQuickInputs(size, 10, complexity);
        expect(inputs.companyProfile.companySize).toBe(size);
        expect(inputs.integrationRequirements.numberOfIntegrations).toBe(10);
        expect(inputs.integrationRequirements.integrationComplexity).toBe(complexity);
        expect(inputs.currency).toBeDefined();
      }
    }
  });

  it("buildQuickInputs respects custom numberOfIntegrations", () => {
    const inputs = buildQuickInputs("mid-market", 25, "complex");
    expect(inputs.integrationRequirements.numberOfIntegrations).toBe(25);
  });

  it("produces reasonable ROI for all company sizes (positive, < 3000%)", () => {
    for (const size of sizes) {
      const inputs = buildQuickInputs(size, 10, "medium");
      const results = calculateROI(inputs);
      expect(results.roiMetrics.roiPercentage, `ROI for ${size}`).toBeGreaterThan(0);
      // High ROI is expected when custom build involves significant dev opportunity cost
      // vs low Appmixer subscription cost. 3000% is the upper bound for realistic scenarios.
      expect(results.roiMetrics.roiPercentage, `ROI for ${size}`).toBeLessThan(3000);
    }
  });

  it("produces positive 3-year savings for all company sizes", () => {
    for (const size of sizes) {
      const inputs = buildQuickInputs(size, 10, "medium");
      const results = calculateROI(inputs);
      expect(results.roiMetrics.threeYearSavings).toBeGreaterThan(0);
    }
  });

  it("produces payback period < 36 months for all defaults", () => {
    for (const size of sizes) {
      const inputs = buildQuickInputs(size, 10, "medium");
      const results = calculateROI(inputs);
      expect(results.roiMetrics.paybackPeriodMonths).toBeLessThan(36);
    }
  });
});
