"use client";

import { useReducer, useCallback, useMemo } from "react";
import type {
  CalculatorInputs,
  CompanyProfileInputs,
  IntegrationRequirementsInputs,
  CurrentCostsInputs,
  Currency,
} from "@/types/calculator";
import {
  defaultCompanyProfile,
  defaultIntegrationRequirements,
  defaultCurrentCosts,
} from "@/types/calculator";
import type { CalculationResults } from "@/types/results";
import { calculateROI } from "@/lib/calculations";

type CalculatorStep = 1 | 2 | 3;

interface CalculatorState {
  currentStep: CalculatorStep;
  currency: Currency;
  companyProfile: CompanyProfileInputs;
  integrationRequirements: IntegrationRequirementsInputs;
  currentCosts: CurrentCostsInputs;
}

type CalculatorAction =
  | { type: "SET_STEP"; payload: CalculatorStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_CURRENCY"; payload: Currency }
  | { type: "UPDATE_COMPANY_PROFILE"; payload: Partial<CompanyProfileInputs> }
  | { type: "UPDATE_INTEGRATION_REQUIREMENTS"; payload: Partial<IntegrationRequirementsInputs> }
  | { type: "UPDATE_CURRENT_COSTS"; payload: Partial<CurrentCostsInputs> }
  | { type: "RESET" };

const initialState: CalculatorState = {
  currentStep: 1,
  currency: "USD",
  companyProfile: defaultCompanyProfile,
  integrationRequirements: defaultIntegrationRequirements,
  currentCosts: defaultCurrentCosts,
};

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 3) as CalculatorStep,
      };
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1) as CalculatorStep,
      };
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "UPDATE_COMPANY_PROFILE":
      return {
        ...state,
        companyProfile: { ...state.companyProfile, ...action.payload },
      };
    case "UPDATE_INTEGRATION_REQUIREMENTS":
      return {
        ...state,
        integrationRequirements: {
          ...state.integrationRequirements,
          ...action.payload,
        },
      };
    case "UPDATE_CURRENT_COSTS":
      return {
        ...state,
        currentCosts: { ...state.currentCosts, ...action.payload },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const inputs: CalculatorInputs = useMemo(
    () => ({
      companyProfile: state.companyProfile,
      integrationRequirements: state.integrationRequirements,
      currentCosts: state.currentCosts,
      currency: state.currency,
    }),
    [
      state.companyProfile,
      state.integrationRequirements,
      state.currentCosts,
      state.currency,
    ]
  );

  const results: CalculationResults = useMemo(() => calculateROI(inputs), [inputs]);

  const setStep = useCallback((step: CalculatorStep) => {
    dispatch({ type: "SET_STEP", payload: step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const setCurrency = useCallback((currency: Currency) => {
    dispatch({ type: "SET_CURRENCY", payload: currency });
  }, []);

  const updateCompanyProfile = useCallback(
    (updates: Partial<CompanyProfileInputs>) => {
      dispatch({ type: "UPDATE_COMPANY_PROFILE", payload: updates });
    },
    []
  );

  const updateIntegrationRequirements = useCallback(
    (updates: Partial<IntegrationRequirementsInputs>) => {
      dispatch({ type: "UPDATE_INTEGRATION_REQUIREMENTS", payload: updates });
    },
    []
  );

  const updateCurrentCosts = useCallback(
    (updates: Partial<CurrentCostsInputs>) => {
      dispatch({ type: "UPDATE_CURRENT_COSTS", payload: updates });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    inputs,
    results,
    setStep,
    nextStep,
    prevStep,
    setCurrency,
    updateCompanyProfile,
    updateIntegrationRequirements,
    updateCurrentCosts,
    reset,
  };
}

export type UseCalculatorReturn = ReturnType<typeof useCalculator>;
