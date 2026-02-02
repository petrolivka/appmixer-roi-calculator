import { describe, it, expect } from "vitest";
import { generateEmailTemplate, generateSlackMessage, generateSummaryText } from "./shareTemplates";
import { defaultCalculatorInputs } from "@/types/calculator";
import { calculateROI } from "@/lib/calculations";
import type { Currency } from "@/types/calculator";

describe("shareTemplates", () => {
  const inputs = defaultCalculatorInputs;
  const results = calculateROI(inputs);
  const url = "https://example.com/results?data=abc123";

  describe("generateEmailTemplate", () => {
    it("returns subject and body", () => {
      const { subject, body } = generateEmailTemplate(inputs, results, url);
      expect(subject).toBeTruthy();
      expect(body).toBeTruthy();
    });

    it("includes ROI percentage in subject", () => {
      const { subject } = generateEmailTemplate(inputs, results, url);
      expect(subject).toContain(`${results.roiMetrics.roiPercentage}%`);
    });

    it("includes key metrics in body", () => {
      const { body } = generateEmailTemplate(inputs, results, url);
      expect(body).toContain(`${results.roiMetrics.roiPercentage}%`);
      expect(body).toContain("Payback Period");
      expect(body).toContain("Break-Even");
      expect(body).toContain(url);
    });

    it("uses correct currency symbol", () => {
      const eurInputs = { ...inputs, currency: "EUR" as Currency };
      const eurResults = calculateROI(eurInputs);
      const { body } = generateEmailTemplate(eurInputs, eurResults, url);
      expect(body).toContain("€");
    });
  });

  describe("generateSlackMessage", () => {
    it("contains markdown bold formatting", () => {
      const msg = generateSlackMessage(inputs, results, url);
      expect(msg).toContain("*");
    });

    it("includes ROI and savings", () => {
      const msg = generateSlackMessage(inputs, results, url);
      expect(msg).toContain(`${results.roiMetrics.roiPercentage}% ROI`);
      expect(msg).toContain("savings");
    });

    it("includes link", () => {
      const msg = generateSlackMessage(inputs, results, url);
      expect(msg).toContain(url);
    });
  });

  describe("generateSummaryText", () => {
    it("is a single-line summary", () => {
      const text = generateSummaryText(inputs, results);
      expect(text.includes("\n")).toBe(false);
    });

    it("includes key metrics", () => {
      const text = generateSummaryText(inputs, results);
      expect(text).toContain("ROI:");
      expect(text).toContain("Savings:");
      expect(text).toContain("Payback:");
      expect(text).toContain("Break-even:");
    });
  });
});
