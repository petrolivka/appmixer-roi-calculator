import { describe, it, expect } from 'vitest'
import { calculateBenefits } from './benefits'
import type { CalculatorInputs } from '@/types/calculator'

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
    it('should be zero (already captured in cost comparison)', () => {
      const result = calculateBenefits(baseInputs)
      // Development time savings are captured in the cost difference between
      // custom build initialDevelopment and Appmixer implementationCost
      expect(result.developmentTimeSavings).toBe(0)
    })

    it('should remain zero regardless of complexity', () => {
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

      expect(simpleResult.developmentTimeSavings).toBe(0)
      expect(complexResult.developmentTimeSavings).toBe(0)
    })
  })

  describe('maintenance reduction', () => {
    it('should be zero (already captured in cost comparison)', () => {
      const result = calculateBenefits(baseInputs)
      // Maintenance reduction is captured in the cost difference between
      // custom build developerOpportunityCost and Appmixer ongoingManagement
      expect(result.maintenanceReduction).toBe(0)
    })

    it('should remain zero regardless of dev hours', () => {
      const inputs: CalculatorInputs = {
        ...baseInputs,
        currentCosts: {
          ...baseInputs.currentCosts,
          devHoursOnIntegrationPerMonth: 80,
        },
      }

      const result = calculateBenefits(inputs)
      expect(result.maintenanceReduction).toBe(0)
    })
  })

  describe('time-to-market value (ONE-TIME benefit)', () => {
    it('should calculate TTM value for medium complexity, mid-market', () => {
      const result = calculateBenefits(baseInputs)

      // Medium: 1 month saved
      // Mid-market: 1.5x multiplier
      // Base: $5000
      // Value: 1 × 5000 × 1.5 = 7500
      expect(result.timeToMarketValue).toBe(7500)
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

      // Simple: 0.5 months saved
      // Mid-market: 1.5x multiplier
      // Value: 0.5 × 5000 × 1.5 = 3750
      expect(result.timeToMarketValue).toBe(3750)
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

      // Complex: 2 months saved
      // Mid-market: 1.5x multiplier
      // Value: 2 × 5000 × 1.5 = 15000
      expect(result.timeToMarketValue).toBe(15000)
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

      // Medium: 1 month saved
      // SMB: 1x multiplier
      // Value: 1 × 5000 × 1 = 5000
      expect(result.timeToMarketValue).toBe(5000)
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

      // Medium: 1 month saved
      // Enterprise: 3x multiplier
      // Value: 1 × 5000 × 3 = 15000
      expect(result.timeToMarketValue).toBe(15000)
    })
  })

  describe('error reduction (ANNUAL benefit)', () => {
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

  describe('churn reduction (ANNUAL benefit, conservative)', () => {
    it('should calculate churn reduction for end-user facing integrations - mid-market', () => {
      const result = calculateBenefits(baseInputs)

      // Mid-market estimated churn cost: 30000 (conservative)
      // Reduction: 30000 × 0.10 = 3000 (10% attribution)
      expect(result.churnReduction).toBe(3000)
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

      // SMB estimated churn cost: 10000 (conservative)
      // Reduction: 10000 × 0.10 = 1000
      expect(result.churnReduction).toBe(1000)
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

      // Enterprise estimated churn cost: 100000 (conservative)
      // Reduction: 100000 × 0.10 = 10000
      expect(result.churnReduction).toBe(10000)
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

  describe('deal win rate improvement (ANNUAL benefit, conservative)', () => {
    it('should calculate deal win rate improvement for end-user facing - mid-market', () => {
      const result = calculateBenefits(baseInputs)

      // Mid-market: 30 deals/year × 0.05 = 1.5 additional deals
      // Deal value: 15000
      // Value: 1.5 × 15000 = 22500
      expect(result.dealWinRateImprovement).toBe(22500)
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

      // SMB: 50 deals/year × 0.05 = 2.5 additional deals
      // Deal value: 3000
      // Value: 2.5 × 3000 = 7500
      expect(result.dealWinRateImprovement).toBe(7500)
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

      // Enterprise: 10 deals/year × 0.05 = 0.5 additional deals
      // Deal value: 50000
      // Value: 0.5 × 50000 = 25000
      expect(result.dealWinRateImprovement).toBe(25000)
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
