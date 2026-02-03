import { competitors, Competitor, CompetitorTier } from '@/data/competitors';

export interface CompetitorCostResult {
  competitor: Competitor;
  monthlyUnits: number;
  tier: CompetitorTier;
  annualCost: number;
  monthlyCost: number;
  vsAppmixer: {
    difference: number;
    percentDiff: number;
    cheaper: 'appmixer' | 'competitor' | 'similar';
  };
}

/**
 * Find the tier that accommodates the given units
 */
function findTier(tiers: CompetitorTier[], units: number): CompetitorTier {
  const sorted = [...tiers].sort((a, b) => a.units - b.units);
  const tier = sorted.find((t) => t.units >= units);
  return tier || sorted[sorted.length - 1];
}

/**
 * Calculate competitor cost based on user's monthly operations
 */
export function calculateCompetitorCost(
  competitorId: string,
  monthlyOperations: number,
  appmixerAnnualCost: number
): CompetitorCostResult | null {
  const competitor = competitors.find((c) => c.id === competitorId);
  if (!competitor) return null;

  const monthlyUnits = Math.round(monthlyOperations * competitor.unitMapping);
  const tier = findTier(competitor.tiers, monthlyUnits);

  const difference = tier.annual - appmixerAnnualCost;
  const percentDiff =
    appmixerAnnualCost > 0
      ? Math.round((difference / appmixerAnnualCost) * 100)
      : 0;

  let cheaper: 'appmixer' | 'competitor' | 'similar';
  if (Math.abs(percentDiff) < 10) {
    cheaper = 'similar';
  } else if (difference > 0) {
    cheaper = 'appmixer';
  } else {
    cheaper = 'competitor';
  }

  return {
    competitor,
    monthlyUnits,
    tier,
    annualCost: tier.annual,
    monthlyCost: tier.monthly,
    vsAppmixer: {
      difference,
      percentDiff,
      cheaper,
    },
  };
}

/**
 * Calculate all competitors at once
 */
export function calculateAllCompetitors(
  monthlyOperations: number,
  appmixerAnnualCost: number
): CompetitorCostResult[] {
  return competitors
    .map((c) => calculateCompetitorCost(c.id, monthlyOperations, appmixerAnnualCost))
    .filter((r): r is CompetitorCostResult => r !== null);
}

/**
 * Format currency for display
 */
export function formatCompetitorCost(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
