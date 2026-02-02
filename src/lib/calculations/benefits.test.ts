import { describe, it, expect } from 'vitest'
import { calculateBenefits } from './benefits'
import type { CalculatorInputs } from '@/types/calculator'
import { BENCHMARKS } from '@/lib/constants/benchmarks'

describe('calculateBenefits', () => {
  const baseInputs: CalculatorInputs = {
    companyProfile: {
      companySize: 'mid-market',
      industryVertical: 'saas',
      numberOfDevelopers: 10,
      developerHourlyCost: 80,
      currentIntegrationApproach: 'custom-code',
    },
    integrationRequirements: {
      numberOfIntegrations: 10,
      integrationComplexity: 'medium',
      endUserFacing: true,
      expectedMonthlyApiCalls: 100000,
      selfHostedRequired: false,
      appmixerMonthlyCost: 999,
    },
    currentCosts: {
      currentIntegrationSpend: 0,
      devHoursOnIntegrationPerMonth: 40,
      integrationIncidentsPerMonth: 5,
    },
    currency: 'USD',
  }

  describe('development time savings', () => {
    it('should calculate development time savings at 64%', () => {
      const result = calculateBenefits(baseInputs)

      // Custom build: 10 × 1.0 × 15000 = 150000
      // Hours: 150000 / 80 = 1875
      // Savings: 1875 × 0.64 = 1200 hours
      // Value: 1200 × 80 = 96000
      expect(result.developmentTimeSavings).toBe(96000)
    })

    it('should scale with complexity', () => {
      const simpleInputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          integrationComplexity: 'simple',
        },
      }

      const complexInputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          integrationComplexity: 'complex',
        },
      }

      const simpleResult = calculateBenefits(simpleInputs)
      const complexResult = calculateBenefits(complexInputs)

      // Complex should be 4x simple (2.0 / 0.5)
      expect(complexResult.developmentTimeSavings).toBe(simpleResult.developmentTimeSavings * 4)
    })
  })

  describe('maintenance reduction', () => {
    it('should calculate maintenance reduction at 70%', () => {
      const result = calculateBenefits(baseInputs)

      // Current maintenance: 40 hours/month × 80/hour × 12 = 38400
      // Reduction: 38400 × 0.70 = 26880
      expect(result.maintenanceReduction).toBe(26880)
    })

    it('should scale with dev hours', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        currentCosts: {
          ...baseInputs.currentCosts,
          devHoursOnIntegrationPerMonth: 80,
        },
      }

      const result = calculateBenefits(inputs)

      // Current maintenance: 80 hours/month × 80/hour × 12 = 76800
      // Reduction: 76800 × 0.70 = 53760
      expect(result.maintenanceReduction).toBe(53760)
    })
  })

  describe('time-to-market value', () => {
    it('should calculate TTM value for medium complexity, mid-market', () => {
      const result = calculateBenefits(baseInputs)

      // Medium: 2 months saved
      // Mid-market: 2x multiplier
      // Value: 2 × 10000 × 2 = 40000
      expect(result.timeToMarketValue).toBe(40000)
    })

    it('should calculate TTM value for simple complexity', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          integrationComplexity: 'simple',
        },
      }

      const result = calculateBenefits(inputs)

      // Simple: 1 month saved
      // Mid-market: 2x multiplier
      // Value: 1 × 10000 × 2 = 20000
      expect(result.timeToMarketValue).toBe(20000)
    })

    it('should calculate TTM value for complex complexity', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          integrationComplexity: 'complex',
        },
      }

      const result = calculateBenefits(inputs)

      // Complex: 4 months saved
      // Mid-market: 2x multiplier
      // Value: 4 × 10000 × 2 = 80000
      expect(result.timeToMarketValue).toBe(80000)
    })

    it('should scale with company size - SMB', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        companyProfile: {
          ...baseInputs.companyProfile,
          companySize: 'smb',
        },
      }

      const result = calculateBenefits(inputs)

      // Medium: 2 months saved
      // SMB: 1x multiplier
      // Value: 2 × 10000 × 1 = 20000
      expect(result.timeToMarketValue).toBe(20000)
    })

    it('should scale with company size - Enterprise', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        companyProfile: {
          ...baseInputs.companyProfile,
          companySize: 'enterprise',
        },
      }

      const result = calculateBenefits(inputs)

      // Medium: 2 months saved
      // Enterprise: 5x multiplier
      // Value: 2 × 10000 × 5 = 100000
      expect(result.timeToMarketValue).toBe(100000)
    })
  })

  describe('error reduction', () => {
    it('should calculate error reduction with 95% auto-handling', () => {
      const result = calculateBenefits(baseInputs)

      // Incidents: 5/month × 12 = 60
      // Reduced: 60 × 0.95 = 57
      // Value: 57 × 500 = 28500
      expect(result.errorReduction).toBe(28500)
    })

    it('should scale with incidents', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        currentCosts: {
          ...baseInputs.currentCosts,
          integrationIncidentsPerMonth: 10,
        },
      }

      const result = calculateBenefits(inputs)

      // Incidents: 10/month × 12 = 120
      // Reduced: 120 × 0.95 = 114
      // Value: 114 × 500 = 57000
      expect(result.errorReduction).toBe(57000)
    })
  })

  describe('churn reduction', () => {
    it('should calculate churn reduction for end-user facing integrations - mid-market', () => {
      const result = calculateBenefits(baseInputs)

      // Mid-market estimated churn cost: 100000
      // Reduction: 100000 × 0.40 = 40000
      expect(result.churnReduction).toBe(40000)
    })

    it('should calculate churn reduction for SMB', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        companyProfile: {
          ...baseInputs.companyProfile,
          companySize: 'smb',
        },
      }

      const result = calculateBenefits(inputs)

      // SMB estimated churn cost: 25000
      // Reduction: 25000 × 0.40 = 10000
      expect(result.churnReduction).toBe(10000)
    })

    it('should calculate churn reduction for enterprise', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        companyProfile: {
          ...baseInputs.companyProfile,
          companySize: 'enterprise',
        },
      }

      const result = calculateBenefits(inputs)

      // Enterprise estimated churn cost: 500000
      // Reduction: 500000 × 0.40 = 200000
      expect(result.churnReduction).toBe(200000)
    })

    it('should be zero for non-end-user facing integrations', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          endUserFacing: false,
        },
      }

      const result = calculateBenefits(inputs)
      expect(result.churnReduction).toBe(0)
    })
  })

  describe('deal win rate improvement', () => {
    it('should calculate deal win rate improvement for end-user facing - mid-market', () => {
      const result = calculateBenefits(baseInputs)

      // Mid-market: 50 deals/year × 0.20 = 10 additional deals
      // Deal value: 25000
      // Value: 10 × 25000 = 250000
      expect(result.dealWinRateImprovement).toBe(250000)
    })

    it('should calculate deal win rate improvement for SMB', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        companyProfile: {
          ...baseInputs.companyProfile,
          companySize: 'smb',
        },
      }

      const result = calculateBenefits(inputs)

      // SMB: 100 deals/year × 0.20 = 20 additional deals
      // Deal value: 5000
      // Value: 20 × 5000 = 100000
      expect(result.dealWinRateImprovement).toBe(100000)
    })

    it('should calculate deal win rate improvement for enterprise', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        companyProfile: {
          ...baseInputs.companyProfile,
          companySize: 'enterprise',
        },
      }

      const result = calculateBenefits(inputs)

      // Enterprise: 20 deals/year × 0.20 = 4 additional deals
      // Deal value: 100000
      // Value: 4 × 100000 = 400000
      expect(result.dealWinRateImprovement).toBe(400000)
    })

    it('should be zero for non-end-user facing integrations', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          endUserFacing: false,
        },
      }

      const result = calculateBenefits(inputs)
      expect(result.dealWinRateImprovement).toBe(0)
    })
  })

  describe('total benefits', () => {
    it('should sum all benefit categories correctly', () => {
      const result = calculateBenefits(baseInputs)

      const expectedTotal =
        result.developmentTimeSavings +
        result.maintenanceReduction +
        result.timeToMarketValue +
        result.errorReduction +
        result.churnReduction +
        result.dealWinRateImprovement

      expect(result.total).toBe(expectedTotal)
    })

    it('should exclude churn and deal win for non-end-user integrations', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        integrationRequirements: {
          ...baseInputs.integrationRequirements,
          endUserFacing: false,
        },
      }

      const result = calculateBenefits(inputs)

      expect(result.churnReduction).toBe(0)
      expect(result.dealWinRateImprovement).toBe(0)

      const expectedTotal =
        result.developmentTimeSavings +
        result.maintenanceReduction +
        result.timeToMarketValue +
        result.errorReduction

      expect(result.total).toBe(expectedTotal)
    })
  })
})
