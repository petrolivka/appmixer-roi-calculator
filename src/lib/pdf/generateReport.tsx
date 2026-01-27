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

// Appmixer brand palette (matching the app)
const colors = {
  primary: "#F3153C",
  primaryLight: "#FFF1F2",
  primaryMuted: "#FECDD3",
  rose: "#E11D48",
  emerald: "#10B981",
  emeraldDark: "#065F46",
  emeraldLight: "#D1FAE5",
  red: "#DC2626",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  foreground: "#1A1A2E",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  background: "#FFFFFF",
  backgroundAlt: "#F8FAFC",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.foreground,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  headerAccent: {
    width: 50,
    height: 4,
    backgroundColor: colors.rose,
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: colors.muted,
  },
  dateBadge: {
    marginTop: 8,
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  dateBadgeText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: "bold",
  },

  // Sections
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.foreground,
    marginBottom: 10,
    paddingBottom: 6,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  // Metric cards
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricBoxHighlight: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  metricLabel: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  metricValueAlt: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.foreground,
  },
  metricValueGreen: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.emerald,
  },
  metricValueAmber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.amber,
  },

  // Tables
  table: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  tableHeader: {
    backgroundColor: colors.backgroundAlt,
    borderBottomColor: colors.border,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: "right",
  },
  tableTotalRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 0,
  },

  // Savings summary
  summaryBox: {
    backgroundColor: colors.emeraldLight,
    padding: 16,
    borderRadius: 8,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.emeraldDark,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.emerald,
  },

  // Assumptions
  assumptions: {
    backgroundColor: colors.backgroundAlt,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assumptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  assumptionRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0,
  },
  assumptionLabel: {
    color: colors.muted,
    fontSize: 10,
  },
  assumptionValue: {
    fontWeight: "bold",
    fontSize: 10,
  },

  // CTA
  ctaSection: {
    backgroundColor: colors.primary,
    padding: 22,
    borderRadius: 8,
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 6,
  },
  ctaText: {
    color: colors.white,
    fontSize: 10,
    opacity: 0.9,
  },
  ctaLink: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 10,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: colors.mutedLight,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 15,
    right: 40,
    fontSize: 8,
    color: colors.mutedLight,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
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
          <View style={styles.headerAccent} />
          <Text style={styles.title}>ROI Analysis Report</Text>
          <Text style={styles.subtitle}>
            Appmixer Integration Platform vs. Custom Build
          </Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Executive Summary Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricBoxHighlight}>
              <Text style={styles.metricLabel}>Total ROI</Text>
              <Text style={styles.metricValue}>{roiMetrics.roiPercentage}%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Payback Period</Text>
              <Text style={styles.metricValueAlt}>
                {roiMetrics.paybackPeriodMonths.toFixed(1)} mo
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>3-Year Savings</Text>
              <Text style={styles.metricValueGreen}>
                {formatCurrencyCompact(roiMetrics.threeYearSavings, currency)}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Break-Even</Text>
              <Text style={styles.metricValueAmber}>
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
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Period</Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>Custom Build</Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>Appmixer</Text>
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
            <View style={styles.tableTotalRow}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Total (3 Years)
              </Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: colors.red }]}>
                {formatCurrency(customBuildCosts.yearlyBreakdown.total, currency)}
              </Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: colors.primary }]}>
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
            <View style={styles.assumptionRowLast}>
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
          <View style={styles.headerAccent} />
          <Text style={styles.title}>Detailed Cost Breakdown</Text>
        </View>

        {/* Custom Build Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Build Cost Components</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Component</Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>Amount</Text>
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
            <View style={styles.tableTotalRow}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>Total (3 Years)</Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: colors.red }]}>
                {formatCurrency(customBuildCosts.yearlyBreakdown.total, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Appmixer Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appmixer Cost Components</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Component</Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>Amount</Text>
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
            <View style={styles.tableTotalRow}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>Total (3 Years)</Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: colors.primary }]}>
                {formatCurrency(appmixerCosts.yearlyBreakdown.total, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Benefits Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projected Benefits</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Benefit Category</Text>
              <Text style={[styles.tableCellRight, styles.tableHeaderText]}>Annual Value</Text>
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
            <View style={styles.tableTotalRow}>
              <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                Total Annual Benefits
              </Text>
              <Text style={[styles.tableCellRight, { fontWeight: "bold", color: colors.emerald }]}>
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
          <Text style={styles.ctaLink}>
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
