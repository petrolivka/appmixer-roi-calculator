import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { CalculatorInputs } from "@/types/calculator";
import type { CalculationResults } from "@/types/results";
import { CURRENCY_SYMBOLS } from "@/lib/currency";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingBottom: 5,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metricBox: {
    width: "23%",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  metricLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
    paddingHorizontal: 5,
  },
  summaryBox: {
    backgroundColor: "#dcfce7",
    padding: 15,
    borderRadius: 4,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#166534",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#166534",
  },
  assumptions: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 4,
  },
  assumptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  assumptionLabel: {
    color: "#64748b",
  },
  assumptionValue: {
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 10,
  },
  ctaSection: {
    backgroundColor: "#2563eb",
    padding: 20,
    borderRadius: 4,
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  ctaText: {
    color: "#ffffff",
    fontSize: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 15,
    right: 40,
    fontSize: 8,
    color: "#94a3b8",
  },
});

interface ReportDocumentProps {
  inputs: CalculatorInputs;
  results: CalculationResults;
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || "$";
  return `${symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function formatCurrencyCompact(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || "$";
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }
  return `${symbol}${amount.toFixed(0)}`;
}

function ReportDocument({ inputs, results }: ReportDocumentProps) {
  const { roiMetrics, customBuildCosts, appmixerCosts, benefits } = results;
  const { companyProfile, integrationRequirements, currency } = inputs;

  return (
    <Document>
      {/* Page 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ROI Analysis Report</Text>
          <Text style={styles.subtitle}>
            Appmixer Integration Platform vs. Custom Build
          </Text>
          <Text style={[styles.subtitle, { marginTop: 5 }]}>
            Generated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Executive Summary Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Total ROI</Text>
              <Text style={styles.metricValue}>{roiMetrics.roiPercentage}%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Payback Period</Text>
              <Text style={styles.metricValue}>
                {roiMetrics.paybackPeriodMonths.toFixed(1)} mo
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>3-Year Savings</Text>
              <Text style={styles.metricValue}>
                {formatCurrencyCompact(roiMetrics.threeYearSavings, currency)}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Break-Even</Text>
              <Text style={styles.metricValue}>
                Month {roiMetrics.breakEvenMonth}
              </Text>
            </View>
          </View>
        </View>

        {/* Cost Comparison Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3-Year Cost Comparison</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Cost Category</Text>
              <Text style={styles.tableCellRight}>Custom Build</Text>
              <Text style={styles.tableCellRight}>Appmixer</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Year 1</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.yearlyBreakdown.year1, currency)}
              </Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(appmixerCosts.yearlyBreakdown.year1, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Year 2</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.yearlyBreakdown.year2, currency)}
              </Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(appmixerCosts.yearlyBreakdown.year2, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Year 3</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.yearlyBreakdown.year3, currency)}
              </Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(appmixerCosts.yearlyBreakdown.year3, currency)}
              </Text>
            </View>
            <View style={[styles.tableRow, { borderBottomWidth: 2 }]}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Total (3 Years)
              </Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: "#dc2626" }]}>
                {formatCurrency(customBuildCosts.yearlyBreakdown.total, currency)}
              </Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: "#2563eb" }]}>
                {formatCurrency(appmixerCosts.yearlyBreakdown.total, currency)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Your 3-Year Savings with Appmixer</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(roiMetrics.threeYearSavings, currency)}
            </Text>
          </View>
        </View>

        {/* Input Assumptions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Assumptions</Text>
          <View style={styles.assumptions}>
            <View style={styles.assumptionRow}>
              <Text style={styles.assumptionLabel}>Company Size</Text>
              <Text style={styles.assumptionValue}>
                {companyProfile.companySize.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </View>
            <View style={styles.assumptionRow}>
              <Text style={styles.assumptionLabel}>Number of Integrations</Text>
              <Text style={styles.assumptionValue}>
                {integrationRequirements.numberOfIntegrations}
              </Text>
            </View>
            <View style={styles.assumptionRow}>
              <Text style={styles.assumptionLabel}>Integration Complexity</Text>
              <Text style={styles.assumptionValue}>
                {integrationRequirements.integrationComplexity.charAt(0).toUpperCase() +
                  integrationRequirements.integrationComplexity.slice(1)}
              </Text>
            </View>
            <View style={styles.assumptionRow}>
              <Text style={styles.assumptionLabel}>Developer Hourly Cost</Text>
              <Text style={styles.assumptionValue}>
                {formatCurrency(companyProfile.developerHourlyCost, currency)}/hr
              </Text>
            </View>
            <View style={styles.assumptionRow}>
              <Text style={styles.assumptionLabel}>End-User Facing</Text>
              <Text style={styles.assumptionValue}>
                {integrationRequirements.endUserFacing ? "Yes" : "No"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            This report is based on industry benchmarks from Nucleus Research, Informatica, and Gartner.
            Actual results may vary based on implementation specifics.
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>

      {/* Page 2: Detailed Breakdown */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Detailed Cost Breakdown</Text>
        </View>

        {/* Custom Build Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Build Cost Components</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Component</Text>
              <Text style={styles.tableCellRight}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Initial Development</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.initialDevelopment, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Annual Maintenance (per year)</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.annualMaintenance, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Infrastructure (per year)</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.infrastructureCosts, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Developer Opportunity Cost (per year)</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(customBuildCosts.developerOpportunityCost, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Appmixer Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appmixer Cost Components</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Component</Text>
              <Text style={styles.tableCellRight}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Implementation (one-time)</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(appmixerCosts.implementationCost, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Platform Subscription (per year)</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(appmixerCosts.platformSubscription, currency)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Ongoing Management (per year)</Text>
              <Text style={styles.tableCellRight}>
                {formatCurrency(appmixerCosts.ongoingManagement, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projected Benefits</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Benefit Category</Text>
              <Text style={styles.tableCellRight}>Annual Value</Text>
            </View>
            {benefits.developmentTimeSavings > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Development Time Savings</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(benefits.developmentTimeSavings, currency)}
                </Text>
              </View>
            )}
            {benefits.maintenanceReduction > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Maintenance Reduction</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(benefits.maintenanceReduction, currency)}
                </Text>
              </View>
            )}
            {benefits.timeToMarketValue > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Time-to-Market Value</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(benefits.timeToMarketValue, currency)}
                </Text>
              </View>
            )}
            {benefits.errorReduction > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Error Reduction</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(benefits.errorReduction, currency)}
                </Text>
              </View>
            )}
            {benefits.churnReduction > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Churn Reduction</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(benefits.churnReduction, currency)}
                </Text>
              </View>
            )}
            {benefits.dealWinRateImprovement > 0 && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Deal Win Rate Improvement</Text>
                <Text style={styles.tableCellRight}>
                  {formatCurrency(benefits.dealWinRateImprovement, currency)}
                </Text>
              </View>
            )}
            <View style={[styles.tableRow, { borderBottomWidth: 2 }]}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Total Annual Benefits
              </Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: "#16a34a" }]}>
                {formatCurrency(benefits.total, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaText}>
            Schedule a demo with our team to see how Appmixer can help you achieve these results.
          </Text>
          <Text style={[styles.ctaText, { marginTop: 10 }]}>
            Visit: https://appmixer.com/contact
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Generated by Appmixer ROI Calculator | https://appmixer.com
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

export async function generatePdfReport(
  inputs: CalculatorInputs,
  results: CalculationResults
): Promise<void> {
  const blob = await pdf(<ReportDocument inputs={inputs} results={results} />).toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `appmixer-roi-report-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
