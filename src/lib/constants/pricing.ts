// Appmixer pricing tiers (representative pricing for calculator purposes)
// These can be adjusted based on actual pricing

export interface PricingTier {
  name: string;
  monthlyPrice: number;
  includedApiCalls: number;
  features: string[];
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  starter: {
    name: "Starter",
    monthlyPrice: 499,
    includedApiCalls: 50000,
    features: ["Basic integrations", "Email support", "Standard connectors"],
  },
  professional: {
    name: "Professional",
    monthlyPrice: 999,
    includedApiCalls: 250000,
    features: ["Advanced workflows", "Priority support", "Custom connectors", "White-labeling"],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 2499,
    includedApiCalls: 1000000,
    features: ["Unlimited workflows", "Dedicated support", "Custom development", "SLA", "Self-hosted option"],
  },
} as const;

export function getRecommendedTier(
  apiCalls: number,
  selfHosted: boolean,
  endUserFacing: boolean
): keyof typeof PRICING_TIERS {
  if (selfHosted || apiCalls > 500000) {
    return "enterprise";
  }
  if (endUserFacing || apiCalls > 100000) {
    return "professional";
  }
  return "starter";
}

export function getMonthlyPlatformCost(
  apiCalls: number,
  selfHosted: boolean,
  endUserFacing: boolean
): number {
  const tier = getRecommendedTier(apiCalls, selfHosted, endUserFacing);
  return PRICING_TIERS[tier].monthlyPrice;
}
