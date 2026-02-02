import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'
import {
  defaultCompanyProfile,
  defaultIntegrationRequirements,
  defaultCurrentCosts,
} from '@/types/calculator'

describe('useCalculator', () => {
  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCalculator())

      expect(result.current.state.currentStep).toBe(1)
      expect(result.current.state.currency).toBe('USD')
      expect(result.current.state.companyProfile).toEqual(defaultCompanyProfile)
      expect(result.current.state.integrationRequirements).toEqual(defaultIntegrationRequirements)
      expect(result.current.state.currentCosts).toEqual(defaultCurrentCosts)
    })

    it('should have valid inputs object', () => {
      const { result } = renderHook(() => useCalculator())

      expect(result.current.inputs).toHaveProperty('companyProfile')
      expect(result.current.inputs).toHaveProperty('integrationRequirements')
      expect(result.current.inputs).toHaveProperty('currentCosts')
      expect(result.current.inputs).toHaveProperty('currency')
    })

    it('should have valid results object', () => {
      const { result } = renderHook(() => useCalculator())

      expect(result.current.results).toHaveProperty('customBuildCosts')
      expect(result.current.results).toHaveProperty('appmixerCosts')
      expect(result.current.results).toHaveProperty('benefits')
      expect(result.current.results).toHaveProperty('roiMetrics')
      expect(result.current.results).toHaveProperty('monthlyProjection')
    })
  })

  describe('step navigation', () => {
    it('should navigate to next step', () => {
      const { result } = renderHook(() => useCalculator())

      expect(result.current.state.currentStep).toBe(1)

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.state.currentStep).toBe(2)

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.state.currentStep).toBe(3)
    })

    it('should not go beyond step 3', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.setStep(3)
      })

      act(() => {
        result.current.nextStep()
      })

      expect(result.current.state.currentStep).toBe(3)
    })

    it('should navigate to previous step', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.setStep(3)
      })

      expect(result.current.state.currentStep).toBe(3)

      act(() => {
        result.current.prevStep()
      })

      expect(result.current.state.currentStep).toBe(2)

      act(() => {
        result.current.prevStep()
      })

      expect(result.current.state.currentStep).toBe(1)
    })

    it('should not go below step 1', () => {
      const { result } = renderHook(() => useCalculator())

      expect(result.current.state.currentStep).toBe(1)

      act(() => {
        result.current.prevStep()
      })

      expect(result.current.state.currentStep).toBe(1)
    })

    it('should set step directly', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.setStep(2)
      })

      expect(result.current.state.currentStep).toBe(2)

      act(() => {
        result.current.setStep(1)
      })

      expect(result.current.state.currentStep).toBe(1)

      act(() => {
        result.current.setStep(3)
      })

      expect(result.current.state.currentStep).toBe(3)
    })
  })

  describe('currency management', () => {
    it('should update currency', () => {
      const { result } = renderHook(() => useCalculator())

      expect(result.current.state.currency).toBe('USD')

      act(() => {
        result.current.setCurrency('EUR')
      })

      expect(result.current.state.currency).toBe('EUR')

      act(() => {
        result.current.setCurrency('GBP')
      })

      expect(result.current.state.currency).toBe('GBP')
    })

    it('should update inputs when currency changes', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.setCurrency('EUR')
      })

      expect(result.current.inputs.currency).toBe('EUR')
    })
  })

  describe('company profile updates', () => {
    it('should update single field', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCompanyProfile({ companySize: 'enterprise' })
      })

      expect(result.current.state.companyProfile.companySize).toBe('enterprise')
      expect(result.current.state.companyProfile.industryVertical).toBe(
        defaultCompanyProfile.industryVertical
      )
    })

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCompanyProfile({
          companySize: 'smb',
          numberOfDevelopers: 5,
          developerHourlyCost: 100,
        })
      })

      expect(result.current.state.companyProfile.companySize).toBe('smb')
      expect(result.current.state.companyProfile.numberOfDevelopers).toBe(5)
      expect(result.current.state.companyProfile.developerHourlyCost).toBe(100)
    })

    it('should merge updates with existing state', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCompanyProfile({ companySize: 'enterprise' })
      })

      act(() => {
        result.current.updateCompanyProfile({ numberOfDevelopers: 50 })
      })

      expect(result.current.state.companyProfile.companySize).toBe('enterprise')
      expect(result.current.state.companyProfile.numberOfDevelopers).toBe(50)
    })
  })

  describe('integration requirements updates', () => {
    it('should update single field', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateIntegrationRequirements({ numberOfIntegrations: 20 })
      })

      expect(result.current.state.integrationRequirements.numberOfIntegrations).toBe(20)
    })

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateIntegrationRequirements({
          numberOfIntegrations: 15,
          integrationComplexity: 'complex',
          endUserFacing: false,
        })
      })

      expect(result.current.state.integrationRequirements.numberOfIntegrations).toBe(15)
      expect(result.current.state.integrationRequirements.integrationComplexity).toBe('complex')
      expect(result.current.state.integrationRequirements.endUserFacing).toBe(false)
    })

    it('should merge updates with existing state', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateIntegrationRequirements({ integrationComplexity: 'simple' })
      })

      act(() => {
        result.current.updateIntegrationRequirements({ appmixerMonthlyCost: 500 })
      })

      expect(result.current.state.integrationRequirements.integrationComplexity).toBe('simple')
      expect(result.current.state.integrationRequirements.appmixerMonthlyCost).toBe(500)
    })
  })

  describe('current costs updates', () => {
    it('should update single field', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCurrentCosts({ devHoursOnIntegrationPerMonth: 80 })
      })

      expect(result.current.state.currentCosts.devHoursOnIntegrationPerMonth).toBe(80)
    })

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCurrentCosts({
          currentIntegrationSpend: 50000,
          devHoursOnIntegrationPerMonth: 60,
          integrationIncidentsPerMonth: 10,
        })
      })

      expect(result.current.state.currentCosts.currentIntegrationSpend).toBe(50000)
      expect(result.current.state.currentCosts.devHoursOnIntegrationPerMonth).toBe(60)
      expect(result.current.state.currentCosts.integrationIncidentsPerMonth).toBe(10)
    })

    it('should merge updates with existing state', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCurrentCosts({ devHoursOnIntegrationPerMonth: 100 })
      })

      act(() => {
        result.current.updateCurrentCosts({ integrationIncidentsPerMonth: 15 })
      })

      expect(result.current.state.currentCosts.devHoursOnIntegrationPerMonth).toBe(100)
      expect(result.current.state.currentCosts.integrationIncidentsPerMonth).toBe(15)
    })
  })

  describe('results recalculation', () => {
    it('should recalculate results when company profile changes', () => {
      const { result } = renderHook(() => useCalculator())

      const initialROI = result.current.results.roiMetrics.roiPercentage

      act(() => {
        result.current.updateCompanyProfile({ developerHourlyCost: 200 })
      })

      const newROI = result.current.results.roiMetrics.roiPercentage

      // ROI should change when hourly cost changes
      expect(newROI).not.toBe(initialROI)
    })

    it('should recalculate results when integration requirements change', () => {
      const { result } = renderHook(() => useCalculator())

      const initialSavings = result.current.results.roiMetrics.threeYearSavings

      act(() => {
        result.current.updateIntegrationRequirements({ numberOfIntegrations: 20 })
      })

      const newSavings = result.current.results.roiMetrics.threeYearSavings

      // Savings should change when number of integrations changes
      expect(newSavings).not.toBe(initialSavings)
    })

    it('should recalculate results when current costs change', () => {
      const { result } = renderHook(() => useCalculator())

      const initialBenefits = result.current.results.benefits.total

      act(() => {
        result.current.updateCurrentCosts({ devHoursOnIntegrationPerMonth: 80 })
      })

      const newBenefits = result.current.results.benefits.total

      // Benefits should change when dev hours change
      expect(newBenefits).not.toBe(initialBenefits)
    })
  })

  describe('reset functionality', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useCalculator())

      // Make some changes
      act(() => {
        result.current.setStep(3)
        result.current.setCurrency('EUR')
        result.current.updateCompanyProfile({ companySize: 'enterprise' })
        result.current.updateIntegrationRequirements({ numberOfIntegrations: 20 })
        result.current.updateCurrentCosts({ devHoursOnIntegrationPerMonth: 80 })
      })

      // Verify changes were applied
      expect(result.current.state.currentStep).toBe(3)
      expect(result.current.state.currency).toBe('EUR')
      expect(result.current.state.companyProfile.companySize).toBe('enterprise')

      // Reset
      act(() => {
        result.current.reset()
      })

      // Verify everything is back to defaults
      expect(result.current.state.currentStep).toBe(1)
      expect(result.current.state.currency).toBe('USD')
      expect(result.current.state.companyProfile).toEqual(defaultCompanyProfile)
      expect(result.current.state.integrationRequirements).toEqual(defaultIntegrationRequirements)
      expect(result.current.state.currentCosts).toEqual(defaultCurrentCosts)
    })

    it('should reset results to default calculation', () => {
      const { result } = renderHook(() => useCalculator())

      const initialResults = result.current.results

      // Make changes
      act(() => {
        result.current.updateCompanyProfile({ developerHourlyCost: 200 })
      })

      // Results should be different
      expect(result.current.results.roiMetrics.roiPercentage).not.toBe(
        initialResults.roiMetrics.roiPercentage
      )

      // Reset
      act(() => {
        result.current.reset()
      })

      // Results should match initial results
      expect(result.current.results.roiMetrics.roiPercentage).toBe(
        initialResults.roiMetrics.roiPercentage
      )
    })
  })

  describe('inputs synchronization', () => {
    it('should keep inputs in sync with state', () => {
      const { result } = renderHook(() => useCalculator())

      act(() => {
        result.current.updateCompanyProfile({ companySize: 'enterprise' })
        result.current.updateIntegrationRequirements({ numberOfIntegrations: 15 })
        result.current.updateCurrentCosts({ devHoursOnIntegrationPerMonth: 60 })
        result.current.setCurrency('EUR')
      })

      expect(result.current.inputs.companyProfile.companySize).toBe('enterprise')
      expect(result.current.inputs.integrationRequirements.numberOfIntegrations).toBe(15)
      expect(result.current.inputs.currentCosts.devHoursOnIntegrationPerMonth).toBe(60)
      expect(result.current.inputs.currency).toBe('EUR')
    })
  })

  describe('function stability', () => {
    it('should have stable function references', () => {
      const { result, rerender } = renderHook(() => useCalculator())

      const initialFunctions = {
        setStep: result.current.setStep,
        nextStep: result.current.nextStep,
        prevStep: result.current.prevStep,
        setCurrency: result.current.setCurrency,
        updateCompanyProfile: result.current.updateCompanyProfile,
        updateIntegrationRequirements: result.current.updateIntegrationRequirements,
        updateCurrentCosts: result.current.updateCurrentCosts,
        reset: result.current.reset,
      }

      // Trigger a re-render
      act(() => {
        result.current.updateCompanyProfile({ companySize: 'enterprise' })
      })

      rerender()

      // Function references should be the same
      expect(result.current.setStep).toBe(initialFunctions.setStep)
      expect(result.current.nextStep).toBe(initialFunctions.nextStep)
      expect(result.current.prevStep).toBe(initialFunctions.prevStep)
      expect(result.current.setCurrency).toBe(initialFunctions.setCurrency)
      expect(result.current.updateCompanyProfile).toBe(initialFunctions.updateCompanyProfile)
      expect(result.current.updateIntegrationRequirements).toBe(
        initialFunctions.updateIntegrationRequirements
      )
      expect(result.current.updateCurrentCosts).toBe(initialFunctions.updateCurrentCosts)
      expect(result.current.reset).toBe(initialFunctions.reset)
    })
  })
})
