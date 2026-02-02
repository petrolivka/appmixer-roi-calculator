import { describe, it, expect } from 'vitest'
import { calculateAppmixerCosts } from './appmixerCosts'
import type { CalculatorInputs } from '@/types/calculator'

describe('calculateAppmixerCosts', () => {
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

  it('should calculate platform subscription correctly', () => {
    const result = calculateAppmixerCosts(baseInputs)
    expect(result.platformSubscription).toBe(999 * 12)
  })

  it('should handle different monthly subscription costs', () => {
    const inputs500: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        appmixerMonthlyCost: 500,
      },
    }

    const inputs2000: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        appmixerMonthlyCost: 2000,
      },
    }

    const result500 = calculateAppmixerCosts(inputs500)
    const result2000 = calculateAppmixerCosts(inputs2000)

    expect(result500.platformSubscription).toBe(500 * 12)
    expect(result2000.platformSubscription).toBe(2000 * 12)
  })

  it('should calculate implementation cost as 15% of custom build time', () => {
    const result = calculateAppmixerCosts(baseInputs)

    // Custom build: 10 integrations × 1.0 (medium) × 15000 = 150000
    // In hours: 150000 / 80 = 1875 hours
    // Appmixer implementation: 1875 × 0.15 = 281.25 hours
    // Cost: 281.25 × 80 = 22500
    const expectedImplementationCost = 22500

    expect(result.implementationCost).toBe(expectedImplementationCost)
  })

  it('should calculate implementation cost for simple complexity', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        integrationComplexity: 'simple',
      },
    }

    const result = calculateAppmixerCosts(inputs)

    // Custom build: 10 integrations × 0.5 (simple) × 15000 = 75000
    // In hours: 75000 / 80 = 937.5 hours
    // Appmixer implementation: 937.5 × 0.15 = 140.625 hours
    // Cost: 140.625 × 80 = 11250
    const expectedImplementationCost = 11250

    expect(result.implementationCost).toBe(expectedImplementationCost)
  })

  it('should calculate implementation cost for complex complexity', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        integrationComplexity: 'complex',
      },
    }

    const result = calculateAppmixerCosts(inputs)

    // Custom build: 10 integrations × 2.0 (complex) × 15000 = 300000
    // In hours: 300000 / 80 = 3750 hours
    // Appmixer implementation: 3750 × 0.15 = 562.5 hours
    // Cost: 562.5 × 80 = 45000
    const expectedImplementationCost = 45000

    expect(result.implementationCost).toBe(expectedImplementationCost)
  })

  it('should calculate ongoing management as 10% of custom maintenance', () => {
    const result = calculateAppmixerCosts(baseInputs)

    // Custom maintenance: 10 hours/integration × 10 integrations = 100 hours
    // Appmixer maintenance: 100 × 0.1 = 10 hours
    // Cost: 10 × 80 = 800
    const expectedOngoingManagement = 800

    expect(result.ongoingManagement).toBe(expectedOngoingManagement)
  })

  it('should scale costs with number of integrations', () => {
    const inputs5: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        numberOfIntegrations: 5,
      },
    }

    const inputs10: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        numberOfIntegrations: 10,
      },
    }

    const result5 = calculateAppmixerCosts(inputs5)
    const result10 = calculateAppmixerCosts(inputs10)

    // Implementation and management should scale with integrations
    expect(result10.implementationCost).toBe(result5.implementationCost * 2)
    expect(result10.ongoingManagement).toBe(result5.ongoingManagement * 2)
  })

  it('should calculate yearly breakdown correctly', () => {
    const result = calculateAppmixerCosts(baseInputs)

    const expectedYear1 = result.implementationCost + result.platformSubscription + result.ongoingManagement
    const expectedYear2 = result.platformSubscription + result.ongoingManagement
    const expectedYear3 = result.platformSubscription + result.ongoingManagement

    expect(result.yearlyBreakdown.year1).toBe(expectedYear1)
    expect(result.yearlyBreakdown.year2).toBe(expectedYear2)
    expect(result.yearlyBreakdown.year3).toBe(expectedYear3)
    expect(result.yearlyBreakdown.total).toBe(expectedYear1 + expectedYear2 + expectedYear3)
  })

  it('should handle different developer hourly rates', () => {
    const inputs50: CalculatorInputs = {
      ...baseInputs,
      companyProfile: {
        ...baseInputs.companyProfile,
        developerHourlyCost: 50,
      },
    }

    const inputs150: CalculatorInputs = {
      ...baseInputs,
      companyProfile: {
        ...baseInputs.companyProfile,
        developerHourlyCost: 150,
      },
    }

    const result50 = calculateAppmixerCosts(inputs50)
    const result150 = calculateAppmixerCosts(inputs150)

    // Implementation cost is based on hours, so higher hourly rate means higher cost
    // But the hours are calculated from BASE_INTEGRATION_COST / hourlyRate
    // So: hours = (10 * 1.0 * 15000) / rate
    // Cost = hours * 0.15 * rate = (150000 / rate) * 0.15 * rate = 150000 * 0.15 = 22500
    // Implementation cost should be the same regardless of hourly rate!
    expect(result150.implementationCost).toBe(result50.implementationCost)

    // Management costs should scale with hourly rate (same hours, different rate)
    expect(result150.ongoingManagement).toBe(result50.ongoingManagement * 3)

    // Platform subscription should be the same
    expect(result150.platformSubscription).toBe(result50.platformSubscription)
  })

  it('should handle edge case with 1 integration', () => {
    const inputs: CalculatorInputs = {
      ...baseInputs,
      integrationRequirements: {
        ...baseInputs.integrationRequirements,
        numberOfIntegrations: 1,
      },
    }

    const result = calculateAppmixerCosts(inputs)

    // Custom build: 1 × 1.0 × 15000 = 15000
    // In hours: 15000 / 80 = 187.5 hours
    // Appmixer: 187.5 × 0.15 = 28.125 hours
    // Cost: 28.125 × 80 = 2250
    expect(result.implementationCost).toBe(2250)

    // Maintenance: 10 hours × 1 × 0.1 = 1 hour × 80 = 80
    expect(result.ongoingManagement).toBe(80)
  })
})
