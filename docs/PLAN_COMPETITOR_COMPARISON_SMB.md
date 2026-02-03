# Implementation Plan: SMB Competitor Comparison

**Date:** 2026-02-03  
**PRD:** PRD_COMPETITOR_COMPARISON_SMB.md  
**Effort:** 4-5 hours  
**Dependencies:** None (self-contained feature)

---

## Overview

Implementace srovnání Appmixer vs Zapier/Make/n8n na results page. Čistě client-side, žádný backend.

---

## File Structure

```
src/
├── data/
│   └── competitors.ts          # NEW: Competitor pricing data
├── lib/
│   └── competitorPricing.ts    # NEW: Cost calculation logic
├── components/
│   └── results/
│       ├── CompetitorComparison.tsx      # NEW: Main section component
│       ├── CompetitorSummaryTable.tsx    # NEW: Summary table
│       └── CompetitorDetailCard.tsx      # NEW: Expanded detail view
└── app/
    └── results/
        └── page.tsx            # UPDATE: Add CompetitorComparison
```

---

## Phase 1: Data Layer (1h)

### `src/data/competitors.ts`

```typescript
export interface CompetitorTier {
  units: number;      // tasks, operations, or executions
  monthly: number;
  annual: number;
}

export interface Competitor {
  id: 'zapier' | 'make' | 'n8n';
  name: string;
  unitName: string;           // "task", "operation", "execution"
  unitMapping: number;        // multiplier from user's "operations" 
  pricingUrl: string;
  lastVerified: string;       // ISO date
  tiers: CompetitorTier[];
  
  // Feature comparison
  features: {
    selfHosted: boolean;
    embedded: boolean;
    unlimitedOption: boolean;
    connectorCount: string;
  };
  
  // Positioning
  advantages: string[];       // What they do better
  limitations: string[];      // What they lack vs Appmixer
  bestFor: string;
}

export const competitors: Competitor[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    unitName: 'task',
    unitMapping: 1.0,         // 1 operation ≈ 1 task
    pricingUrl: 'https://zapier.com/pricing',
    lastVerified: '2026-02-03',
    tiers: [
      { units: 100, monthly: 0, annual: 0 },
      { units: 750, monthly: 19.99, annual: 240 },
      { units: 2000, monthly: 49, annual: 588 },
      { units: 3000, monthly: 69, annual: 828 },
      { units: 5000, monthly: 99, annual: 1188 },
      { units: 10000, monthly: 149, annual: 1788 },
      { units: 20000, monthly: 249, annual: 2988 },
      { units: 50000, monthly: 399, annual: 4788 },
      { units: 100000, monthly: 599, annual: 7188 },
      { units: 200000, monthly: 799, annual: 9588 },
      { units: 500000, monthly: 999, annual: 11988 },
      { units: 1000000, monthly: 1499, annual: 17988 },
      { units: 1500000, monthly: 1999, annual: 23988 },
      { units: 2000000, monthly: 2499, annual: 29988 },
    ],
    features: {
      selfHosted: false,
      embedded: false,
      unlimitedOption: false,
      connectorCount: '7,000+',
    },
    advantages: [
      'Largest connector ecosystem (7,000+ apps)',
      'Most recognized brand — easy stakeholder buy-in',
      'Best for non-technical users',
    ],
    limitations: [
      'No self-hosted deployment option',
      'No embedded/white-label capability',
      'Task-based pricing scales expensively',
    ],
    bestFor: 'Simple workflows, non-technical teams, wide app coverage',
  },
  
  {
    id: 'make',
    name: 'Make',
    unitName: 'operation',
    unitMapping: 1.5,         // 1 operation ≈ 1.5 Make operations
    pricingUrl: 'https://make.com/en/pricing',
    lastVerified: '2026-02-03',
    tiers: [
      { units: 1000, monthly: 0, annual: 0 },
      { units: 10000, monthly: 9, annual: 108 },
      { units: 40000, monthly: 16, annual: 192 },
      { units: 150000, monthly: 29, annual: 348 },
      { units: 800000, monthly: 99, annual: 1188 },
    ],
    features: {
      selfHosted: false,
      embedded: false,
      unlimitedOption: false,
      connectorCount: '1,500+',
    },
    advantages: [
      'Most affordable for low-to-medium volume',
      'Excellent visual workflow builder',
      'Strong conditional logic and data transformation',
    ],
    limitations: [
      'No self-hosted deployment option',
      'No embedded/white-label capability',
      'Operation counting can be confusing',
    ],
    bestFor: 'Budget-conscious teams, complex visual workflows',
  },
  
  {
    id: 'n8n',
    name: 'n8n',
    unitName: 'execution',
    unitMapping: 0.3,         // 1 operation ≈ 0.3 executions (workflow runs)
    pricingUrl: 'https://n8n.io/pricing',
    lastVerified: '2026-02-03',
    tiers: [
      { units: 0, monthly: 0, annual: 0 },           // Self-hosted
      { units: 2500, monthly: 20, annual: 240 },     // Starter
      { units: 10000, monthly: 50, annual: 600 },    // Pro
    ],
    features: {
      selfHosted: true,
      embedded: false,
      unlimitedOption: true,    // Self-hosted = unlimited
      connectorCount: '400+',
    },
    advantages: [
      'Free self-hosted option with unlimited executions',
      'Open source — full transparency and customization',
      'Strong developer community',
    ],
    limitations: [
      'No embedded/white-label capability',
      'Smaller connector library',
      'Self-hosted requires DevOps expertise',
    ],
    bestFor: 'Technical teams wanting self-hosted, developers, budget with DIY',
  },
];

// Appmixer key advantages (for comparison display)
export const appmixerAdvantages = [
  'Self-hosted deployment option',
  'Embedded white-label for your SaaS',
  'Predictable pricing without per-task limits',
  'API-first architecture',
];
```

### `src/lib/competitorPricing.ts`

```typescript
import { competitors, Competitor, CompetitorTier } from '@/data/competitors';

export interface CompetitorCostResult {
  competitor: Competitor;
  monthlyUnits: number;       // Units in their system
  tier: CompetitorTier;
  annualCost: number;
  monthlyCost: number;
  vsAppmixer: {
    difference: number;       // Positive = competitor more expensive
    percentDiff: number;      // Percentage difference
    cheaper: 'appmixer' | 'competitor' | 'similar';
  };
}

/**
 * Calculate competitor cost based on user's monthly operations
 */
export function calculateCompetitorCost(
  competitorId: string,
  monthlyOperations: number,
  appmixerAnnualCost: number
): CompetitorCostResult | null {
  const competitor = competitors.find(c => c.id === competitorId);
  if (!competitor) return null;
  
  // Map user operations to competitor units
  const monthlyUnits = Math.round(monthlyOperations * competitor.unitMapping);
  
  // Find appropriate tier
  const tier = findTier(competitor.tiers, monthlyUnits);
  
  // Calculate comparison
  const difference = tier.annual - appmixerAnnualCost;
  const percentDiff = appmixerAnnualCost > 0 
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
    .map(c => calculateCompetitorCost(c.id, monthlyOperations, appmixerAnnualCost))
    .filter((r): r is CompetitorCostResult => r !== null);
}

/**
 * Find the tier that accommodates the given units
 */
function findTier(tiers: CompetitorTier[], units: number): CompetitorTier {
  // Sort by units ascending
  const sorted = [...tiers].sort((a, b) => a.units - b.units);
  
  // Find first tier that can handle the volume
  const tier = sorted.find(t => t.units >= units);
  
  // If over max, return the highest tier
  return tier || sorted[sorted.length - 1];
}

/**
 * Format currency for display
 */
export function formatCost(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

---

## Phase 2: UI Components (2.5h)

### `src/components/results/CompetitorComparison.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, ExternalLink } from 'lucide-react';
import { CompetitorSummaryTable } from './CompetitorSummaryTable';
import { CompetitorDetailCard } from './CompetitorDetailCard';
import { calculateAllCompetitors, CompetitorCostResult } from '@/lib/competitorPricing';
import { appmixerAdvantages } from '@/data/competitors';

interface Props {
  monthlyOperations: number;
  appmixerAnnualCost: number;
  currency?: string;
}

export function CompetitorComparison({ 
  monthlyOperations, 
  appmixerAnnualCost,
  currency = 'USD' 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  
  const results = calculateAllCompetitors(monthlyOperations, appmixerAnnualCost);
  
  return (
    <section className="mt-8 rounded-lg border bg-card p-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            💡 How does Appmixer compare to alternatives?
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Based on ~{monthlyOperations.toLocaleString()} operations/month
          </p>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Summary Table */}
          <CompetitorSummaryTable
            results={results}
            appmixerAnnualCost={appmixerAnnualCost}
            currency={currency}
            onSelectCompetitor={setSelectedCompetitor}
          />
          
          {/* Appmixer Advantages */}
          <div className="rounded-md bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary">
              ✅ Appmixer advantages over SMB platforms:
            </p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              {appmixerAdvantages.map((adv, i) => (
                <li key={i}>• {adv}</li>
              ))}
            </ul>
          </div>
          
          {/* Detail Card */}
          {selectedCompetitor && (
            <CompetitorDetailCard
              result={results.find(r => r.competitor.id === selectedCompetitor)!}
              appmixerAnnualCost={appmixerAnnualCost}
              monthlyOperations={monthlyOperations}
              currency={currency}
              onClose={() => setSelectedCompetitor(null)}
            />
          )}
          
          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground flex items-start gap-1">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            Pricing from public sources as of Feb 2026. Task/operation mapping is 
            estimated. Contact each vendor for accurate quotes.
          </p>
        </div>
      )}
    </section>
  );
}
```

### `src/components/results/CompetitorSummaryTable.tsx`

```typescript
'use client';

import { CompetitorCostResult, formatCost } from '@/lib/competitorPricing';

interface Props {
  results: CompetitorCostResult[];
  appmixerAnnualCost: number;
  currency: string;
  onSelectCompetitor: (id: string) => void;
}

export function CompetitorSummaryTable({ 
  results, 
  appmixerAnnualCost, 
  currency,
  onSelectCompetitor 
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Platform</th>
            <th className="text-right py-2 font-medium">Est. Annual</th>
            <th className="text-right py-2 font-medium">vs Appmixer</th>
            <th className="text-left py-2 pl-4 font-medium">Key Difference</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Appmixer row */}
          <tr className="border-b bg-primary/5">
            <td className="py-3 font-medium">
              <span className="text-primary">●</span> Appmixer
            </td>
            <td className="text-right py-3 font-semibold">
              {formatCost(appmixerAnnualCost, currency)}
            </td>
            <td className="text-right py-3 text-muted-foreground">—</td>
            <td className="py-3 pl-4 text-muted-foreground">Your configuration</td>
            <td></td>
          </tr>
          
          {/* Competitor rows */}
          {results.map((result) => (
            <tr key={result.competitor.id} className="border-b hover:bg-muted/50">
              <td className="py-3">{result.competitor.name}</td>
              <td className="text-right py-3">
                {formatCost(result.annualCost, currency)}
              </td>
              <td className="text-right py-3">
                <ComparisonBadge result={result} />
              </td>
              <td className="py-3 pl-4 text-muted-foreground text-xs">
                {result.competitor.limitations[0]}
              </td>
              <td className="py-3 pl-2">
                <button
                  onClick={() => onSelectCompetitor(result.competitor.id)}
                  className="text-xs text-primary hover:underline"
                >
                  Details →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonBadge({ result }: { result: CompetitorCostResult }) {
  const { cheaper, percentDiff } = result.vsAppmixer;
  
  if (cheaper === 'similar') {
    return <span className="text-muted-foreground">~same</span>;
  }
  
  if (cheaper === 'appmixer') {
    return (
      <span className="text-red-600">
        +{Math.abs(percentDiff)}% more
      </span>
    );
  }
  
  return (
    <span className="text-green-600">
      {Math.abs(percentDiff)}% less
    </span>
  );
}
```

### `src/components/results/CompetitorDetailCard.tsx`

```typescript
'use client';

import { X, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { CompetitorCostResult, formatCost } from '@/lib/competitorPricing';
import { appmixerAdvantages } from '@/data/competitors';

interface Props {
  result: CompetitorCostResult;
  appmixerAnnualCost: number;
  monthlyOperations: number;
  currency: string;
  onClose: () => void;
}

export function CompetitorDetailCard({
  result,
  appmixerAnnualCost,
  monthlyOperations,
  currency,
  onClose,
}: Props) {
  const { competitor, monthlyUnits, annualCost, vsAppmixer } = result;
  
  return (
    <div className="rounded-lg border bg-muted/30 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-semibold text-lg">
          {competitor.name} vs Appmixer
        </h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Volume mapping */}
      <p className="text-sm text-muted-foreground mb-4">
        Your volume: ~{monthlyOperations.toLocaleString()} ops/month 
        ≈ {monthlyUnits.toLocaleString()} {competitor.unitName}s/month
      </p>
      
      {/* Cost comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-md bg-background p-3">
          <p className="text-xs text-muted-foreground">{competitor.name}</p>
          <p className="text-xl font-bold">{formatCost(annualCost, currency)}/yr</p>
          <p className="text-xs text-muted-foreground">
            {formatCost(result.monthlyCost, currency)}/mo
          </p>
        </div>
        <div className="rounded-md bg-primary/10 p-3">
          <p className="text-xs text-muted-foreground">Appmixer</p>
          <p className="text-xl font-bold text-primary">
            {formatCost(appmixerAnnualCost, currency)}/yr
          </p>
          <p className="text-xs text-muted-foreground">Your configured cost</p>
        </div>
      </div>
      
      {/* Feature comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Appmixer has */}
        <div>
          <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <Check className="h-4 w-4" /> Appmixer has
          </p>
          <ul className="text-sm space-y-1">
            {competitor.limitations.map((item, i) => (
              <li key={i} className="text-muted-foreground">• {item.replace('No ', '')}</li>
            ))}
          </ul>
        </div>
        
        {/* Competitor advantage */}
        <div>
          <p className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> {competitor.name} advantage
          </p>
          <ul className="text-sm space-y-1">
            {competitor.advantages.map((item, i) => (
              <li key={i} className="text-muted-foreground">• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Verdict */}
      <div className="rounded-md bg-background p-4 mb-4">
        <p className="text-sm font-medium mb-1">🎯 Verdict</p>
        <p className="text-sm text-muted-foreground">
          {competitor.name} is best for: {competitor.bestFor}.
          {vsAppmixer.cheaper === 'appmixer' && (
            <> For your requirements, Appmixer provides better value.</>
          )}
          {vsAppmixer.cheaper === 'competitor' && (
            <> {competitor.name} is more affordable, but lacks self-hosted/embedded options.</>
          )}
          {vsAppmixer.cheaper === 'similar' && (
            <> Pricing is similar — choose based on feature needs.</>
          )}
        </p>
      </div>
      
      {/* Source */}
      <a
        href={competitor.pricingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
      >
        <ExternalLink className="h-3 w-3" />
        {competitor.pricingUrl}
      </a>
    </div>
  );
}
```

---

## Phase 3: Integration (0.5h)

### Update `src/app/results/page.tsx`

Add import and component placement:

```typescript
import { CompetitorComparison } from '@/components/results/CompetitorComparison';

// In the JSX, after SensitivityAnalysis:
<CompetitorComparison
  monthlyOperations={inputs.monthlyApiCalls || 10000}
  appmixerAnnualCost={inputs.appmixerMonthlyCost * 12}
  currency={inputs.currency}
/>
```

---

## Phase 4: PDF Export (0.5h)

### Update PDF template

Add optional section to PDF export:

```typescript
// In PDFReport.tsx, add prop:
interface Props {
  // ...existing
  includeCompetitorComparison?: boolean;
}

// Add section if enabled:
{includeCompetitorComparison && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Competitor Comparison</Text>
    <View style={styles.table}>
      {/* Simple table with competitor costs */}
    </View>
    <Text style={styles.disclaimer}>
      Pricing based on public sources as of Feb 2026.
    </Text>
  </View>
)}
```

### Add checkbox in ActionButtons

```typescript
<label className="flex items-center gap-2 text-sm">
  <input
    type="checkbox"
    checked={includeComparison}
    onChange={(e) => setIncludeComparison(e.target.checked)}
  />
  Include competitor comparison in PDF
</label>
```

---

## Testing Checklist

### Unit Tests (`__tests__/competitorPricing.test.ts`)

```typescript
import { calculateCompetitorCost, calculateAllCompetitors } from '@/lib/competitorPricing';

describe('competitorPricing', () => {
  describe('calculateCompetitorCost', () => {
    it('calculates Zapier cost for 10K operations', () => {
      const result = calculateCompetitorCost('zapier', 10000, 5000);
      expect(result?.monthlyUnits).toBe(10000);
      expect(result?.annualCost).toBe(1788); // $149/mo tier
    });
    
    it('calculates Make cost with 1.5x multiplier', () => {
      const result = calculateCompetitorCost('make', 10000, 5000);
      expect(result?.monthlyUnits).toBe(15000); // 10K * 1.5
      expect(result?.annualCost).toBe(192);     // Pro tier
    });
    
    it('handles n8n with 0.3x multiplier', () => {
      const result = calculateCompetitorCost('n8n', 10000, 5000);
      expect(result?.monthlyUnits).toBe(3000);  // 10K * 0.3
      expect(result?.annualCost).toBe(600);     // Pro tier
    });
    
    it('returns cheaper = appmixer when competitor costs more', () => {
      const result = calculateCompetitorCost('zapier', 100000, 5000);
      expect(result?.vsAppmixer.cheaper).toBe('appmixer');
    });
    
    it('returns cheaper = competitor when appmixer costs more', () => {
      const result = calculateCompetitorCost('make', 5000, 10000);
      expect(result?.vsAppmixer.cheaper).toBe('competitor');
    });
  });
  
  describe('calculateAllCompetitors', () => {
    it('returns results for all 3 competitors', () => {
      const results = calculateAllCompetitors(10000, 5000);
      expect(results).toHaveLength(3);
      expect(results.map(r => r.competitor.id)).toEqual(['zapier', 'make', 'n8n']);
    });
  });
});
```

### Manual Testing

- [ ] Summary table renders correctly
- [ ] Click "Details" opens detail card
- [ ] Costs update when inputs change
- [ ] Mobile responsive (table → stacked)
- [ ] PDF checkbox works
- [ ] External links open in new tab
- [ ] Disclaimer text displays

---

## Rollout Plan

1. **Development** — implement in feature branch
2. **Code review** — verify pricing accuracy
3. **Staging** — internal testing with sales team
4. **Production** — deploy behind feature flag (optional)
5. **Monitor** — track engagement, gather feedback

---

## Maintenance

| Task | Frequency |
|------|-----------|
| Verify Zapier pricing | Monthly |
| Verify Make pricing | Monthly |
| Verify n8n pricing | Monthly |
| Update `lastVerified` dates | After each check |
| Review unit mappings | Quarterly |

---

## Future Enhancements

- [ ] User can adjust unit mapping multipliers
- [ ] Add Celigo to comparison (if pricing becomes public)
- [ ] "Email me this comparison" lead capture
- [ ] A/B test collapsed vs expanded default state
