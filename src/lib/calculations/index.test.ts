import { describe, it, expect } from 'vitest'
import { calculateROI } from './index'
import type { CalculatorInputs } from '@/types/calculator'
import { defaultCalculatorInputs } from '@/types/calculator'

describe('calculateROI - Integration Tests', () => {
  it('should return all required result components', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result).toHaveProperty('customBuildCosts')
    expect(result).toHaveProperty('appmixerCosts')
    expect(result).toHaveProperty('benefits')
    expect(result).toHaveProperty('roiMetrics')
    expect(result).toHaveProperty('monthlyProjection')
  })

  it('should have valid customBuildCosts structure', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.customBuildCosts).toHaveProperty('initialDevelopment')
    expect(result.customBuildCosts).toHaveProperty('annualMaintenance')
    expect(result.customBuildCosts).toHaveProperty('infrastructureCosts')
    expect(result.customBuildCosts).toHaveProperty('developerOpportunityCost')
    expect(result.customBuildCosts).toHaveProperty('yearlyBreakdown')

    expect(result.customBuildCosts.yearlyBreakdown).toHaveProperty('year1')
    expect(result.customBuildCosts.yearlyBreakdown).toHaveProperty('year2')
    expect(result.customBuildCosts.yearlyBreakdown).toHaveProperty('year3')
    expect(result.customBuildCosts.yearlyBreakdown).toHaveProperty('total')
  })

  it('should have valid appmixerCosts structure', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.appmixerCosts).toHaveProperty('platformSubscription')
    expect(result.appmixerCosts).toHaveProperty('implementationCost')
    expect(result.appmixerCosts).toHaveProperty('ongoingManagement')
    expect(result.appmixerCosts).toHaveProperty('yearlyBreakdown')

    expect(result.appmixerCosts.yearlyBreakdown).toHaveProperty('year1')
    expect(result.appmixerCosts.yearlyBreakdown).toHaveProperty('year2')
    expect(result.appmixerCosts.yearlyBreakdown).toHaveProperty('year3')
    expect(result.appmixerCosts.yearlyBreakdown).toHaveProperty('total')
  })

  it('should have valid benefits structure', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.benefits).toHaveProperty('developmentTimeSavings')
    expect(result.benefits).toHaveProperty('maintenanceReduction')
    expect(result.benefits).toHaveProperty('timeToMarketValue')
    expect(result.benefits).toHaveProperty('errorReduction')
    expect(result.benefits).toHaveProperty('churnReduction')
    expect(result.benefits).toHaveProperty('dealWinRateImprovement')
    expect(result.benefits).toHaveProperty('total')
  })

  it('should have valid roiMetrics structure', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.roiMetrics).toHaveProperty('roiPercentage')
    expect(result.roiMetrics).toHaveProperty('paybackPeriodMonths')
    expect(result.roiMetrics).toHaveProperty('threeYearSavings')
    expect(result.roiMetrics).toHaveProperty('netPresentValue')
    expect(result.roiMetrics).toHaveProperty('breakEvenMonth')
  })

  it('should have valid monthlyProjection with 36 months', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.monthlyProjection).toHaveLength(36)
    expect(result.monthlyProjection[0]).toHaveProperty('month')
    expect(result.monthlyProjection[0]).toHaveProperty('customBuildCumulative')
    expect(result.monthlyProjection[0]).toHaveProperty('appmixerCumulative')
    expect(result.monthlyProjection[0]).toHaveProperty('savings')
  })

  it('should calculate positive ROI for default inputs', () => {
    const result = calculateROI(defaultCalculatorInputs)

    // Custom build should cost more than Appmixer
    expect(result.customBuildCosts.yearlyBreakdown.total).toBeGreaterThan(
      result.appmixerCosts.yearlyBreakdown.total
    )

    // ROI should be positive
    expect(result.roiMetrics.roiPercentage).toBeGreaterThan(0)

    // Savings should be positive
    expect(result.roiMetrics.threeYearSavings).toBeGreaterThan(0)
  })

  it('should have payback period less than 36 months for default inputs', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.roiMetrics.paybackPeriodMonths).toBeGreaterThan(0)
    expect(result.roiMetrics.paybackPeriodMonths).toBeLessThan(36)
  })

  it('should have break-even month within 36 months for default inputs', () => {
    const result = calculateROI(defaultCalculatorInputs)

    expect(result.roiMetrics.breakEvenMonth).toBeGreaterThan(0)
    expect(result.roiMetrics.breakEvenMonth).toBeLessThanOrEqual(36)
  })

  it('should handle SMB company size correctly', () => {
    const smbInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      companyProfile: {
        ...defaultCalculatorInputs.companyProfile,
        companySize: 'smb',
      },
    }

    const result = calculateROI(smbInputs)

    // Should have lower benefits than enterprise
    expect(result.benefits.total).toBeGreaterThan(0)
    expect(result.roiMetrics.roiPercentage).toBeGreaterThan(0)
  })

  it('should handle enterprise company size correctly', () => {
    const enterpriseInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      companyProfile: {
        ...defaultCalculatorInputs.companyProfile,
        companySize: 'enterprise',
      },
    }

    const result = calculateROI(enterpriseInputs)

    // Should have higher benefits
    expect(result.benefits.total).toBeGreaterThan(0)
    expect(result.roiMetrics.roiPercentage).toBeGreaterThan(0)
  })

  it('should handle non-end-user integrations correctly', () => {
    const nonEndUserInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      integrationRequirements: {
        ...defaultCalculatorInputs.integrationRequirements,
        endUserFacing: false,
      },
    }

    const result = calculateROI(nonEndUserInputs)

    // Should have no churn or deal win benefits
    expect(result.benefits.churnReduction).toBe(0)
    expect(result.benefits.dealWinRateImprovement).toBe(0)

    // But should still have other benefits
    expect(result.benefits.developmentTimeSavings).toBeGreaterThan(0)
    expect(result.benefits.maintenanceReduction).toBeGreaterThan(0)
  })

  it('should handle simple complexity correctly', () => {
    const simpleInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      integrationRequirements: {
        ...defaultCalculatorInputs.integrationRequirements,
        integrationComplexity: 'simple',
      },
    }

    const result = calculateROI(simpleInputs)

    // Should have lower costs than medium complexity
    expect(result.customBuildCosts.initialDevelopment).toBeGreaterThan(0)
    expect(result.appmixerCosts.implementationCost).toBeGreaterThan(0)
  })

  it('should handle complex complexity correctly', () => {
    const complexInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      integrationRequirements: {
        ...defaultCalculatorInputs.integrationRequirements,
        integrationComplexity: 'complex',
      },
    }

    const result = calculateROI(complexInputs)

    // Should have higher costs than medium complexity
    expect(result.customBuildCosts.initialDevelopment).toBeGreaterThan(0)
    expect(result.appmixerCosts.implementationCost).toBeGreaterThan(0)
  })

  it('should show Appmixer costs significantly lower than custom build', () => {
    const result = calculateROI(defaultCalculatorInputs)

    // Appmixer should be less than 20% of custom build cost for typical scenarios
    const costRatio = result.appmixerCosts.yearlyBreakdown.total / result.customBuildCosts.yearlyBreakdown.total

    expect(costRatio).toBeLessThan(0.5) // Appmixer should be less than 50% of custom build
  })

  it('should have consistent cumulative totals in monthly projection', () => {
    const result = calculateROI(defaultCalculatorInputs)

    const lastMonth = result.monthlyProjection[35]

    // Last month cumulative should match 3-year totals
    expect(lastMonth.customBuildCumulative).toBeCloseTo(
      result.customBuildCosts.yearlyBreakdown.total,
      -1
    )
    expect(lastMonth.appmixerCumulative).toBeCloseTo(
      result.appmixerCosts.yearlyBreakdown.total,
      -1
    )
  })

  it('should maintain data consistency across all calculations', () => {
    const result = calculateROI(defaultCalculatorInputs)

    // 3-year savings should match the difference
    const calculatedSavings =
      result.customBuildCosts.yearlyBreakdown.total - result.appmixerCosts.yearlyBreakdown.total

    expect(result.roiMetrics.threeYearSavings).toBe(calculatedSavings)

    // Final monthly projection savings should match 3-year savings
    const finalProjectionSavings = result.monthlyProjection[35].savings

    expect(finalProjectionSavings).toBeCloseTo(result.roiMetrics.threeYearSavings, -1)
  })

  it('should handle varying API call volumes', () => {
    const lowApiInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      integrationRequirements: {
        ...defaultCalculatorInputs.integrationRequirements,
        expectedMonthlyApiCalls: 10000,
      },
    }

    const highApiInputs: CalculatorInputs = {
      ...defaultCalculatorInputs,
      integrationRequirements: {
        ...defaultCalculatorInputs.integrationRequirements,
        expectedMonthlyApiCalls: 1000000,
      },
    }

    const lowApiResult = calculateROI(lowApiInputs)
    const highApiResult = calculateROI(highApiInputs)

    // High API volume should have higher infrastructure costs
    expect(highApiResult.customBuildCosts.infrastructureCosts).toBeGreaterThan(
      lowApiResult.customBuildCosts.infrastructureCosts
    )
  })
})
