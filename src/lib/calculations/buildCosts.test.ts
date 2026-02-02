import { describe, it, expect } from 'vitest'
import { calculateCustomBuildCosts } from './buildCosts'
import type { CalculatorInputs } from '@/types/calculator'
import {
  BASE_INTEGRATION_COST,
  COMPLEXITY_MULTIPLIERS,
  MAINTENANCE_RATE,
  INFRASTRUCTURE_COSTS,
} from '@/lib/constants/benchmarks'

describe('calculateCustomBuildCosts', () => {
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

  it('should calculate costs correctly for medium complexity', () => {
    const result = calculateCustomBuildCosts(baseInputs)

    const expectedInitialDev = 10 * COMPLEXITY_MULTIPLIERS.medium * BASE_INTEGRATION_COST
    const expectedMaintenance = expectedInitialDev * MAINTENANCE_RATE
    const expectedInfra = INFRASTRUCTURE_COSTS.medium * 12
    const expectedDevCost = 40 * 80 * 12

    expect(result.initialDevelopment).toBe(expectedInitialDev)
    expect(result.annualMaintenance).toBe(expectedMaintenance)
    expect(result.infrastructureCosts).toBe(expectedInfra)
    expect(result.developerOpportunityCost).toBe(expectedDevCost)

    const expectedYear1 = expectedInitialDev + expectedMaintenance + expectedInfra + expectedDevCost
    const expectedYear2 = expectedMaintenance + expectedInfra + expectedDevCost

    expect(result.yearlyBreakdown.year1).toBe(expectedYear1)
    expect(result.yearlyBreakdown.year2).toBe(expectedYear2)
    expect(result.yearlyBreakdown.year3).toBe(expectedYear2)
    expect(result.yearlyBreakdown.total).toBe(expectedYear1 + expectedYear2 + expectedYear2)
  })

  it('should calculate costs correctly for simple complexity', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        integrationComplexity: 'simple',
      },
    }

    const result = calculateCustomBuildCosts(inputs)

    const expectedInitialDev = 10 * COMPLEXITY_MULTIPLIERS.simple * BASE_INTEGRATION_COST
    expect(result.initialDevelopment).toBe(expectedInitialDev)
  })

  it('should calculate costs correctly for complex complexity', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        integrationComplexity: 'complex',
      },
    }

    const result = calculateCustomBuildCosts(inputs)

    const expectedInitialDev = 10 * COMPLEXITY_MULTIPLIERS.complex * BASE_INTEGRATION_COST
    expect(result.initialDevelopment).toBe(expectedInitialDev)
  })

  it('should scale costs with number of integrations', () => {
    const inputs5: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        numberOfIntegrations: 5,
      },
    }

    const inputs20: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        numberOfIntegrations: 20,
      },
    }

    const result5 = calculateCustomBuildCosts(inputs5)
    const result20 = calculateCustomBuildCosts(inputs20)

    expect(result20.initialDevelopment).toBe(result5.initialDevelopment * 4)
  })

  it('should use low infrastructure costs for low API calls (<= 50k)', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        expectedMonthlyApiCalls: 30000,
      },
    }

    const result = calculateCustomBuildCosts(inputs)
    expect(result.infrastructureCosts).toBe(INFRASTRUCTURE_COSTS.low * 12)
  })

  it('should use medium infrastructure costs for medium API calls (50k - 500k)', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        expectedMonthlyApiCalls: 200000,
      },
    }

    const result = calculateCustomBuildCosts(inputs)
    expect(result.infrastructureCosts).toBe(INFRASTRUCTURE_COSTS.medium * 12)
  })

  it('should use high infrastructure costs for high API calls (> 500k)', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        expectedMonthlyApiCalls: 1000000,
      },
    }

    const result = calculateCustomBuildCosts(inputs)
    expect(result.infrastructureCosts).toBe(INFRASTRUCTURE_COSTS.high * 12)
  })

  it('should scale developer opportunity cost with hours and hourly rate', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      companyProfile: {
        ...baseInputs.companyProfile,
        developerHourlyCost: 100,
      },
      currentCosts: {
        ...baseInputs.currentCosts,
        devHoursOnIntegrationPerMonth: 80,
      },
    }

    const result = calculateCustomBuildCosts(inputs)
    expect(result.developerOpportunityCost).toBe(80 * 100 * 12)
  })

  it('should handle edge case with 1 integration', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        numberOfIntegrations: 1,
      },
    }

    const result = calculateCustomBuildCosts(inputs)

    const expectedInitialDev = 1 * COMPLEXITY_MULTIPLIERS.medium * BASE_INTEGRATION_COST
    expect(result.initialDevelopment).toBe(expectedInitialDev)
  })

  it('should handle edge case with 0 dev hours', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      currentCosts: {
        ...baseInputs.currentCosts,
        devHoursOnIntegrationPerMonth: 0,
      },
    }

    const result = calculateCustomBuildCosts(inputs)
    expect(result.developerOpportunityCost).toBe(0)
  })
})
