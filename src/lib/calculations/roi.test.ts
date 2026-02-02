import { describe, it, expect } from 'vitest'
import { calculateROIMetrics, generateMonthlyProjection } from './roi'
import type { CustomBuildCosts, AppmixerCosts } from '@/types/results'

describe('calculateROIMetrics', () => {
  const mockCustomBuildCosts: CustomBuildCosts = {
    initialDevelopment: 150000,
    annualMaintenance: 37500,
    infrastructureCosts: 12000,
    developerOpportunityCost: 38400,
    yearlyBreakdown: {
      year1: 237900,
      year2: 87900,
      year3: 87900,
      total: 413700,
    },
  }

  const mockAppmixerCosts: AppmixerCosts = {
    platformSubscription: 11988,
    implementationCost: 22500,
    ongoingManagement: 800,
    yearlyBreakdown: {
      year1: 35288,
      year2: 12788,
      year3: 12788,
      total: 60864,
    },
  }

  it('should calculate ROI percentage correctly', () => {
    const result = calculateROIMetrics(mockCustomBuildCosts, mockAppmixerCosts)

    // ROI = ((413700 - 60864) / 60864) × 100 = 579.8%
    expect(result.roiPercentage).toBe(580) // Rounded
  })

  it('should calculate 3-year savings correctly', () => {
    const result = calculateROIMetrics(mockCustomBuildCosts, mockAppmixerCosts)

    // Savings = 413700 - 60864 = 352836
    expect(result.threeYearSavings).toBe(352836)
  })

  it('should calculate payback period correctly', () => {
    const result = calculateROIMetrics(mockCustomBuildCosts, mockAppmixerCosts)

    // Total investment: 22500 + 11988 = 34488
    // Monthly savings: 352836 / 36 = 9801
    // Payback: 34488 / 9801 = 3.52 months
    expect(result.paybackPeriodMonths).toBeCloseTo(3.5, 1)
  })

  it('should calculate NPV with 10% discount rate', () => {
    const result = calculateROIMetrics(mockCustomBuildCosts, mockAppmixerCosts)

    // Year 1 savings: 237900 - 35288 = 202612
    // Year 2 savings: 87900 - 12788 = 75112
    // Year 3 savings: 87900 - 12788 = 75112
    // NPV = 202612/1.1 + 75112/1.1² + 75112/1.1³
    // NPV = 184193 + 62067 + 56425 = 302685
    expect(result.netPresentValue).toBeCloseTo(302685, -2) // Within 100
  })

  it('should calculate break-even month correctly', () => {
    const result = calculateROIMetrics(mockCustomBuildCosts, mockAppmixerCosts)

    // Break-even should happen when cumulative savings >= initial investment (34488)
    // Monthly savings: ~9801
    // Break-even: ~4 months
    expect(result.breakEvenMonth).toBeLessThanOrEqual(4)
  })

  it('should handle zero savings scenario', () => {
    const equalCosts: AppmixerCosts = {
      ...mockAppmixerCosts,
      yearlyBreakdown: {
        year1: mockCustomBuildCosts.yearlyBreakdown.year1,
        year2: mockCustomBuildCosts.yearlyBreakdown.year2,
        year3: mockCustomBuildCosts.yearlyBreakdown.year3,
        total: mockCustomBuildCosts.yearlyBreakdown.total,
      },
    }

    const result = calculateROIMetrics(mockCustomBuildCosts, equalCosts)

    expect(result.roiPercentage).toBe(0)
    expect(result.threeYearSavings).toBe(0)
    expect(result.paybackPeriodMonths).toBe(0)
  })

  it('should handle negative ROI scenario', () => {
    const expensiveAppmixer: AppmixerCosts = {
      ...mockAppmixerCosts,
      yearlyBreakdown: {
        year1: 500000,
        year2: 200000,
        year3: 200000,
        total: 900000,
      },
    }

    const result = calculateROIMetrics(mockCustomBuildCosts, expensiveAppmixer)

    expect(result.roiPercentage).toBeLessThan(0)
    expect(result.threeYearSavings).toBeLessThan(0)
  })
})

describe('generateMonthlyProjection', () => {
  const mockCustomBuildCosts: CustomBuildCosts = {
    initialDevelopment: 150000,
    annualMaintenance: 37500,
    infrastructureCosts: 12000,
    developerOpportunityCost: 38400,
    yearlyBreakdown: {
      year1: 240000,
      year2: 120000,
      year3: 120000,
      total: 480000,
    },
  }

  const mockAppmixerCosts: AppmixerCosts = {
    platformSubscription: 12000,
    implementationCost: 24000,
    ongoingManagement: 1200,
    yearlyBreakdown: {
      year1: 36000,
      year2: 12000,
      year3: 12000,
      total: 60000,
    },
  }

  it('should generate 36 monthly data points', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    expect(projection).toHaveLength(36)
  })

  it('should start with month 1', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    expect(projection[0].month).toBe(1)
  })

  it('should end with month 36', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    expect(projection[35].month).toBe(36)
  })

  it('should have cumulative costs increasing over time', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)

    // Each month should have higher cumulative costs than the previous
    for (let i = 1; i < projection.length; i++) {
      expect(projection[i].customBuildCumulative).toBeGreaterThan(
        projection[i - 1].customBuildCumulative
      )
      expect(projection[i].appmixerCumulative).toBeGreaterThan(
        projection[i - 1].appmixerCumulative
      )
    }
  })

  it('should have correct cumulative costs at year 1 end (month 12)', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    const month12 = projection[11]

    expect(month12.customBuildCumulative).toBeCloseTo(
      mockCustomBuildCosts.yearlyBreakdown.year1,
      -1
    )
    expect(month12.appmixerCumulative).toBeCloseTo(
      mockAppmixerCosts.yearlyBreakdown.year1,
      -1
    )
  })

  it('should have correct cumulative costs at year 2 end (month 24)', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    const month24 = projection[23]

    const expectedCustom =
      mockCustomBuildCosts.yearlyBreakdown.year1 + mockCustomBuildCosts.yearlyBreakdown.year2
    const expectedAppmixer =
      mockAppmixerCosts.yearlyBreakdown.year1 + mockAppmixerCosts.yearlyBreakdown.year2

    expect(month24.customBuildCumulative).toBeCloseTo(expectedCustom, -1)
    expect(month24.appmixerCumulative).toBeCloseTo(expectedAppmixer, -1)
  })

  it('should have correct cumulative costs at year 3 end (month 36)', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    const month36 = projection[35]

    expect(month36.customBuildCumulative).toBeCloseTo(
      mockCustomBuildCosts.yearlyBreakdown.total,
      -1
    )
    expect(month36.appmixerCumulative).toBeCloseTo(mockAppmixerCosts.yearlyBreakdown.total, -1)
  })

  it('should calculate savings correctly at each month', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)

    projection.forEach((point) => {
      const expectedSavings = point.customBuildCumulative - point.appmixerCumulative
      expect(point.savings).toBeCloseTo(expectedSavings, 0)
    })
  })

  it('should show increasing savings over time', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)

    // Savings should generally increase (custom build costs more)
    for (let i = 1; i < projection.length; i++) {
      expect(projection[i].savings).toBeGreaterThanOrEqual(projection[i - 1].savings)
    }
  })

  it('should have final savings equal to 3-year total savings', () => {
    const projection = generateMonthlyProjection(mockCustomBuildCosts, mockAppmixerCosts)
    const finalPoint = projection[35]

    const expectedSavings =
      mockCustomBuildCosts.yearlyBreakdown.total - mockAppmixerCosts.yearlyBreakdown.total

    expect(finalPoint.savings).toBeCloseTo(expectedSavings, -1)
  })

  it('should handle equal monthly costs across years', () => {
    const equalCosts: CustomBuildCosts = {
      initialDevelopment: 120000,
      annualMaintenance: 30000,
      infrastructureCosts: 12000,
      developerOpportunityCost: 48000,
      yearlyBreakdown: {
        year1: 120000,
        year2: 120000,
        year3: 120000,
        total: 360000,
      },
    }

    const projection = generateMonthlyProjection(equalCosts, mockAppmixerCosts)

    // Monthly costs should be consistent across years
    const month1 = projection[0]
    const month13 = projection[12]
    const month25 = projection[24]

    // Check that monthly increments are similar (within rounding)
    const increment1 = month1.customBuildCumulative
    const increment2 = month13.customBuildCumulative - projection[11].customBuildCumulative
    const increment3 = month25.customBuildCumulative - projection[23].customBuildCumulative

    expect(increment1).toBeCloseTo(increment2, -1)
    expect(increment2).toBeCloseTo(increment3, -1)
  })
})
