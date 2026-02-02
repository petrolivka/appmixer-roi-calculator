import { describe, it, expect } from 'vitest'
import {
  BENCHMARKS,
  COMPLEXITY_MULTIPLIERS,
  BASE_INTEGRATION_COST,
  MAINTENANCE_RATE,
  INFRASTRUCTURE_COSTS,
} from './benchmarks'

describe('BENCHMARKS', () => {
  it('should have all required benchmark fields', () => {
    expect(BENCHMARKS).toHaveProperty('averageIpaasRoi')
    expect(BENCHMARKS).toHaveProperty('averagePaybackMonths')
    expect(BENCHMARKS).toHaveProperty('averageAnnualBenefit')
    expect(BENCHMARKS).toHaveProperty('integrationSpeedImprovement')
    expect(BENCHMARKS).toHaveProperty('timeToMarketAcceleration')
    expect(BENCHMARKS).toHaveProperty('devTimeSavingsPercent')
    expect(BENCHMARKS).toHaveProperty('maintenanceReductionPercent')
    expect(BENCHMARKS).toHaveProperty('errorHandlingAutomation')
    expect(BENCHMARKS).toHaveProperty('churnReductionPercent')
    expect(BENCHMARKS).toHaveProperty('dealWinRateImprovement')
    expect(BENCHMARKS).toHaveProperty('costPerIncident')
    expect(BENCHMARKS).toHaveProperty('monthlyRevenueImpact')
  })

  describe('averageIpaasRoi', () => {
    it('should be a positive number', () => {
      expect(BENCHMARKS.averageIpaasRoi).toBeGreaterThan(0)
    })

    it('should be a reasonable ROI percentage', () => {
      expect(BENCHMARKS.averageIpaasRoi).toBeGreaterThan(100) // At least 100% ROI
      expect(BENCHMARKS.averageIpaasRoi).toBeLessThan(1000) // Less than 1000%
    })
  })

  describe('averagePaybackMonths', () => {
    it('should be a positive number', () => {
      expect(BENCHMARKS.averagePaybackMonths).toBeGreaterThan(0)
    })

    it('should be within a reasonable range (1-12 months)', () => {
      expect(BENCHMARKS.averagePaybackMonths).toBeGreaterThan(0)
      expect(BENCHMARKS.averagePaybackMonths).toBeLessThan(13)
    })
  })

  describe('averageAnnualBenefit', () => {
    it('should be a positive number', () => {
      expect(BENCHMARKS.averageAnnualBenefit).toBeGreaterThan(0)
    })

    it('should be in a reasonable range for enterprise benefits', () => {
      expect(BENCHMARKS.averageAnnualBenefit).toBeGreaterThan(100000) // At least $100k
      expect(BENCHMARKS.averageAnnualBenefit).toBeLessThan(10000000) // Less than $10M
    })
  })

  describe('percentage-based benchmarks', () => {
    it('should have integrationSpeedImprovement as a decimal between 0 and 1', () => {
      expect(BENCHMARKS.integrationSpeedImprovement).toBeGreaterThan(0)
      expect(BENCHMARKS.integrationSpeedImprovement).toBeLessThan(1)
    })

    it('should have devTimeSavingsPercent as a decimal between 0 and 1', () => {
      expect(BENCHMARKS.devTimeSavingsPercent).toBeGreaterThan(0)
      expect(BENCHMARKS.devTimeSavingsPercent).toBeLessThan(1)
    })

    it('should have maintenanceReductionPercent as a decimal between 0 and 1', () => {
      expect(BENCHMARKS.maintenanceReductionPercent).toBeGreaterThan(0)
      expect(BENCHMARKS.maintenanceReductionPercent).toBeLessThan(1)
    })

    it('should have errorHandlingAutomation as a decimal between 0 and 1', () => {
      expect(BENCHMARKS.errorHandlingAutomation).toBeGreaterThan(0)
      expect(BENCHMARKS.errorHandlingAutomation).toBeLessThanOrEqual(1)
    })

    it('should have churnReductionPercent as a decimal between 0 and 1', () => {
      expect(BENCHMARKS.churnReductionPercent).toBeGreaterThan(0)
      expect(BENCHMARKS.churnReductionPercent).toBeLessThan(1)
    })

    it('should have dealWinRateImprovement as a decimal between 0 and 1', () => {
      expect(BENCHMARKS.dealWinRateImprovement).toBeGreaterThan(0)
      expect(BENCHMARKS.dealWinRateImprovement).toBeLessThan(1)
    })
  })

  describe('timeToMarketAcceleration', () => {
    it('should be a positive multiplier', () => {
      expect(BENCHMARKS.timeToMarketAcceleration).toBeGreaterThan(1)
    })

    it('should be within reasonable acceleration range', () => {
      expect(BENCHMARKS.timeToMarketAcceleration).toBeLessThan(100)
    })
  })

  describe('cost benchmarks', () => {
    it('should have costPerIncident as a positive number', () => {
      expect(BENCHMARKS.costPerIncident).toBeGreaterThan(0)
    })

    it('should have costPerIncident in reasonable range ($100-$5000)', () => {
      expect(BENCHMARKS.costPerIncident).toBeGreaterThan(100)
      expect(BENCHMARKS.costPerIncident).toBeLessThan(5000)
    })

    it('should have monthlyRevenueImpact as a positive number', () => {
      expect(BENCHMARKS.monthlyRevenueImpact).toBeGreaterThan(0)
    })

    it('should have monthlyRevenueImpact in reasonable range', () => {
      expect(BENCHMARKS.monthlyRevenueImpact).toBeGreaterThan(1000)
      expect(BENCHMARKS.monthlyRevenueImpact).toBeLessThan(100000)
    })
  })
})

describe('COMPLEXITY_MULTIPLIERS', () => {
  it('should have all complexity levels', () => {
    expect(COMPLEXITY_MULTIPLIERS).toHaveProperty('simple')
    expect(COMPLEXITY_MULTIPLIERS).toHaveProperty('medium')
    expect(COMPLEXITY_MULTIPLIERS).toHaveProperty('complex')
  })

  it('should have simple as the lowest multiplier', () => {
    expect(COMPLEXITY_MULTIPLIERS.simple).toBeLessThan(COMPLEXITY_MULTIPLIERS.medium)
    expect(COMPLEXITY_MULTIPLIERS.simple).toBeLessThan(COMPLEXITY_MULTIPLIERS.complex)
  })

  it('should have medium as the middle multiplier', () => {
    expect(COMPLEXITY_MULTIPLIERS.medium).toBeGreaterThan(COMPLEXITY_MULTIPLIERS.simple)
    expect(COMPLEXITY_MULTIPLIERS.medium).toBeLessThan(COMPLEXITY_MULTIPLIERS.complex)
  })

  it('should have complex as the highest multiplier', () => {
    expect(COMPLEXITY_MULTIPLIERS.complex).toBeGreaterThan(COMPLEXITY_MULTIPLIERS.simple)
    expect(COMPLEXITY_MULTIPLIERS.complex).toBeGreaterThan(COMPLEXITY_MULTIPLIERS.medium)
  })

  it('should have medium as 1.0 (baseline)', () => {
    expect(COMPLEXITY_MULTIPLIERS.medium).toBe(1.0)
  })

  it('should have simple less than 1.0', () => {
    expect(COMPLEXITY_MULTIPLIERS.simple).toBeLessThan(1.0)
    expect(COMPLEXITY_MULTIPLIERS.simple).toBeGreaterThan(0)
  })

  it('should have complex greater than 1.0', () => {
    expect(COMPLEXITY_MULTIPLIERS.complex).toBeGreaterThan(1.0)
  })
})

describe('BASE_INTEGRATION_COST', () => {
  it('should be a positive number', () => {
    expect(BASE_INTEGRATION_COST).toBeGreaterThan(0)
  })

  it('should be in reasonable range ($5,000 - $50,000)', () => {
    expect(BASE_INTEGRATION_COST).toBeGreaterThan(5000)
    expect(BASE_INTEGRATION_COST).toBeLessThan(50000)
  })

  it('should be a whole number', () => {
    expect(BASE_INTEGRATION_COST % 1).toBe(0)
  })
})

describe('MAINTENANCE_RATE', () => {
  it('should be a positive number', () => {
    expect(MAINTENANCE_RATE).toBeGreaterThan(0)
  })

  it('should be a decimal between 0 and 1', () => {
    expect(MAINTENANCE_RATE).toBeLessThan(1)
  })

  it('should be a reasonable maintenance percentage (10%-50%)', () => {
    expect(MAINTENANCE_RATE).toBeGreaterThanOrEqual(0.1)
    expect(MAINTENANCE_RATE).toBeLessThanOrEqual(0.5)
  })
})

describe('INFRASTRUCTURE_COSTS', () => {
  it('should have all tiers', () => {
    expect(INFRASTRUCTURE_COSTS).toHaveProperty('low')
    expect(INFRASTRUCTURE_COSTS).toHaveProperty('medium')
    expect(INFRASTRUCTURE_COSTS).toHaveProperty('high')
  })

  it('should have increasing costs from low to high', () => {
    expect(INFRASTRUCTURE_COSTS.low).toBeLessThan(INFRASTRUCTURE_COSTS.medium)
    expect(INFRASTRUCTURE_COSTS.medium).toBeLessThan(INFRASTRUCTURE_COSTS.high)
  })

  it('should have positive costs for all tiers', () => {
    expect(INFRASTRUCTURE_COSTS.low).toBeGreaterThan(0)
    expect(INFRASTRUCTURE_COSTS.medium).toBeGreaterThan(0)
    expect(INFRASTRUCTURE_COSTS.high).toBeGreaterThan(0)
  })

  it('should have costs in reasonable monthly range ($100 - $5000)', () => {
    expect(INFRASTRUCTURE_COSTS.low).toBeGreaterThan(100)
    expect(INFRASTRUCTURE_COSTS.low).toBeLessThan(5000)

    expect(INFRASTRUCTURE_COSTS.medium).toBeGreaterThan(100)
    expect(INFRASTRUCTURE_COSTS.medium).toBeLessThan(5000)

    expect(INFRASTRUCTURE_COSTS.high).toBeGreaterThan(100)
    expect(INFRASTRUCTURE_COSTS.high).toBeLessThan(5000)
  })

  it('should have medium cost at least 1.5x low cost', () => {
    expect(INFRASTRUCTURE_COSTS.medium).toBeGreaterThanOrEqual(INFRASTRUCTURE_COSTS.low * 1.5)
  })

  it('should have high cost at least 1.5x medium cost', () => {
    expect(INFRASTRUCTURE_COSTS.high).toBeGreaterThanOrEqual(INFRASTRUCTURE_COSTS.medium * 1.5)
  })
})
