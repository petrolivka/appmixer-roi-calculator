# Implementation Plan: Competitor Comparison Feature

**Date:** 2026-02-03  
**Parent:** WOW_IMPROVEMENTS.md — Bod 8  
**Impact:** Medium | **Effort:** High (8-12h)  
**Sprint:** 3

---

## Executive Summary

Přidáme sekci "What if you chose a different platform?" která ukáže uživateli srovnání Appmixer s konkurencí na základě jeho zadaných parametrů. Feature zvýší důvěryhodnost kalkulátoru a pomůže sales konverzacím.

---

## Pricing Research Summary

### 🔴 Tier 1: Enterprise iPaaS (Contact Sales)

| Platform | Pricing Model | Estimated Annual Cost | Public Pricing? |
|----------|---------------|----------------------|-----------------|
| **MuleSoft** | vCores + Messages + Support tier | $50,000 - $500,000+ | ❌ Contact sales |
| **Workato** | Workspace + Tasks | $10,000 - $50,000+ | ⚠️ Partial (starts $10K/yr) |
| **Boomi** | Connectors + Messages | $40,000 median (Vendr data) | ⚠️ Pay-as-you-go from $99/mo |
| **Tray.io** | Custom | $25,000 - $100,000+ | ❌ Contact sales |

**Sources:**
- MuleSoft: cloudconsultings.com/mulesoft-pricing (Nov 2024)
- Workato: spendflo.com/blog/workato-pricing-guide ($10K-$50K range)
- Boomi: vendr.com/marketplace/boomi (median $40,950 from 133 purchases)
- Tray.io: vendr.com (no public pricing, quote-based)

### 🟡 Tier 2: SMB/Prosumer (Public Pricing)

| Platform | Plan | Monthly Cost | Tasks/Operations | Notes |
|----------|------|--------------|------------------|-------|
| **Zapier** | Free | $0 | 100 tasks | 2-step only |
| **Zapier** | Professional | $19.99 | 750 tasks | Multi-step, webhooks |
| **Zapier** | Professional | $49 | 2,000 tasks | |
| **Zapier** | Team | $69 | 2,000 tasks | 25 users, SSO |
| **Zapier** | Team | $199 | 5,000 tasks | |
| **Make** | Free | $0 | 1,000 ops | |
| **Make** | Core | $9 | 10,000 ops | |
| **Make** | Pro | $16 | 10,000 ops | + custom functions |
| **Make** | Teams | $29 | 10,000 ops | + team features |
| **n8n** | Starter | $20 | 2,500 executions | Cloud hosted |
| **n8n** | Pro | $50 | 10,000 executions | |
| **n8n** | Self-hosted | $0 | Unlimited | DIY infrastructure |

**Sources:**
- Zapier: zapier.com/pricing (verified Feb 2026)
- Make: make.com/en/pricing
- n8n: n8n.io/pricing

### 🟢 Tier 3: Embedded Integration Platforms

| Platform | Pricing Model | Estimated Cost | Public Pricing? |
|----------|---------------|----------------|-----------------|
| **Paragon** | Per connected user | Custom | ❌ Contact sales |
| **Prismatic** | Per embedded user | Custom | ❌ Contact sales |
| **Merge** | Per linked account | Starts ~$650/mo | ⚠️ Partial |
| **Cyclr** | Per connector | Custom | ❌ Contact sales |

**Note:** Embedded platforms typically charge per end-user or per active integration, making direct comparison complex.

---

## Feature Specification

### User Flow

1. User completes standard ROI calculation
2. Results page shows new "Compare Alternatives" section
3. User can toggle competitors on/off for comparison
4. Dynamic table updates with their specific inputs

### Comparison Dimensions

```typescript
interface CompetitorProfile {
  id: string;
  name: string;
  tier: 'enterprise' | 'smb' | 'embedded';
  logo?: string;
  
  // Pricing
  pricing: {
    model: 'tasks' | 'operations' | 'connectors' | 'users' | 'custom';
    hasPublicPricing: boolean;
    baseAnnual?: number;        // Starting price if known
    perUnitCost?: number;       // Per task/op/connector
    unitName?: string;          // "task", "operation", "connector"
  };
  
  // Features for comparison
  features: {
    selfHosted: boolean;
    embedded: boolean;
    apiFirst: boolean;
    noCodeBuilder: boolean;
    customConnectors: boolean;
    sso: boolean;
    auditLog: boolean;
    sla: string | null;
  };
  
  // Positioning
  bestFor: string[];            // ["Enterprise", "High volume", "Compliance"]
  limitations: string[];        // ["No self-hosted", "Task limits"]
  
  // Sources
  pricingSource: string;        // URL
  lastVerified: string;         // ISO date
}
```

### Comparison Output

```typescript
interface ComparisonResult {
  competitor: string;
  
  // Cost comparison
  estimatedAnnualCost: number | 'Contact Sales';
  vsAppmixer: {
    difference: number;         // Positive = competitor more expensive
    percentageSavings: number;
  };
  
  // Feature gaps
  missingFeatures: string[];    // Features Appmixer has that competitor lacks
  advantageFeatures: string[];  // Features competitor has that Appmixer lacks (fairness)
  
  // Verdict
  verdict: 'appmixer-wins' | 'competitor-wins' | 'similar' | 'different-usecase';
  verdictReason: string;
}
```

### UI Components

#### `src/components/results/CompetitorComparison.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 How does Appmixer compare?                                  │
│                                                                 │
│  Based on your requirements (20 integrations, medium           │
│  complexity, 500K API calls/month)                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Platform      │ Est. Annual │ vs Appmixer │ Best For    │   │
│  ├───────────────┼─────────────┼─────────────┼─────────────│   │
│  │ 🟢 Appmixer   │ $14,400     │ —           │ Embedded    │   │
│  │ Zapier        │ $6,000      │ 58% less    │ Simple SMB  │   │
│  │ Make          │ $3,600      │ 75% less    │ Budget      │   │
│  │ Workato       │ $25,000+    │ 74% more    │ Enterprise  │   │
│  │ MuleSoft      │ Contact     │ —           │ Enterprise  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ Note: Zapier/Make lack embedded white-label, self-hosted   │
│     options, and have per-task limits that scale with usage.   │
│                                                                 │
│  [Show detailed breakdown ▼]                                    │
│                                                                 │
│  ℹ️ Pricing based on published rates as of Feb 2026.           │
│     Enterprise quotes may vary. Sources linked below.           │
└─────────────────────────────────────────────────────────────────┘
```

#### Detailed Breakdown (expanded)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Detailed Comparison: Appmixer vs Zapier                     │
│                                                                 │
│  YOUR REQUIREMENTS          APPMIXER        ZAPIER              │
│  ──────────────────────────────────────────────────────         │
│  20 integrations            ✅ Included     ✅ Included          │
│  500K tasks/month           ✅ Unlimited    ⚠️ $599/mo (500K)    │
│  Self-hosted option         ✅ Yes          ❌ No                │
│  White-label embedded       ✅ Yes          ❌ No                │
│  Custom connectors          ✅ Yes          ⚠️ Developer plan    │
│  SSO/SAML                   ✅ Yes          ⚠️ Team+ only        │
│                                                                 │
│  ANNUAL COST                $14,400         $7,188 + overages   │
│                                                                 │
│  VERDICT: Zapier is cheaper for simple workflows, but lacks     │
│  embedded capabilities. For your use case (embedded, high       │
│  volume), Appmixer provides better value.                       │
│                                                                 │
│  📎 Source: zapier.com/pricing (verified Feb 2026)              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Files

### `src/data/competitors.ts`

```typescript
export const competitors: CompetitorProfile[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    tier: 'smb',
    pricing: {
      model: 'tasks',
      hasPublicPricing: true,
      baseAnnual: 240,          // $19.99/mo Professional
      perUnitCost: 0.012,       // ~$0.012 per task at scale
      unitName: 'task',
    },
    features: {
      selfHosted: false,
      embedded: false,
      apiFirst: false,
      noCodeBuilder: true,
      customConnectors: true,   // Via developer platform
      sso: true,                // Team+ only
      auditLog: true,           // Team+ only
      sla: null,
    },
    bestFor: ['SMB', 'Simple workflows', 'Non-technical users'],
    limitations: ['No self-hosted', 'No embedded/white-label', 'Task-based pricing scales poorly'],
    pricingSource: 'https://zapier.com/pricing',
    lastVerified: '2026-02-03',
  },
  
  {
    id: 'make',
    name: 'Make (Integromat)',
    tier: 'smb',
    pricing: {
      model: 'operations',
      hasPublicPricing: true,
      baseAnnual: 108,          // $9/mo Core
      perUnitCost: 0.0009,      // ~$0.0009 per operation
      unitName: 'operation',
    },
    features: {
      selfHosted: false,
      embedded: false,
      apiFirst: false,
      noCodeBuilder: true,
      customConnectors: true,
      sso: true,
      auditLog: true,
      sla: null,
    },
    bestFor: ['Budget-conscious', 'Visual workflows', 'Complex logic'],
    limitations: ['No self-hosted', 'No embedded', 'Operation counting complex'],
    pricingSource: 'https://make.com/en/pricing',
    lastVerified: '2026-02-03',
  },
  
  {
    id: 'workato',
    name: 'Workato',
    tier: 'enterprise',
    pricing: {
      model: 'custom',
      hasPublicPricing: false,
      baseAnnual: 10000,        // Starting price
      unitName: 'workspace',
    },
    features: {
      selfHosted: false,
      embedded: true,           // Workato Embedded
      apiFirst: true,
      noCodeBuilder: true,
      customConnectors: true,
      sso: true,
      auditLog: true,
      sla: '99.9%',
    },
    bestFor: ['Enterprise', 'Complex integrations', 'IT teams'],
    limitations: ['No self-hosted', 'High minimum spend', 'Complex pricing'],
    pricingSource: 'https://www.spendflo.com/blog/workato-pricing-guide',
    lastVerified: '2026-02-03',
  },
  
  {
    id: 'mulesoft',
    name: 'MuleSoft',
    tier: 'enterprise',
    pricing: {
      model: 'custom',
      hasPublicPricing: false,
      baseAnnual: 50000,        // Typical minimum
      unitName: 'vCore',
    },
    features: {
      selfHosted: true,         // Runtime Fabric
      embedded: false,
      apiFirst: true,
      noCodeBuilder: false,     // Developer-focused
      customConnectors: true,
      sso: true,
      auditLog: true,
      sla: '99.99%',
    },
    bestFor: ['Large enterprise', 'API-led connectivity', 'Salesforce ecosystem'],
    limitations: ['Very expensive', 'Steep learning curve', 'Requires developers'],
    pricingSource: 'https://cloudconsultings.com/mulesoft-pricing/',
    lastVerified: '2026-02-03',
  },
  
  {
    id: 'boomi',
    name: 'Boomi',
    tier: 'enterprise',
    pricing: {
      model: 'connectors',
      hasPublicPricing: false,
      baseAnnual: 40000,        // Median from Vendr
      perUnitCost: 5000,        // ~$5K per connector/year
      unitName: 'connector',
    },
    features: {
      selfHosted: true,         // Molecule/Atom
      embedded: false,
      apiFirst: true,
      noCodeBuilder: true,
      customConnectors: true,
      sso: true,
      auditLog: true,
      sla: '99.9%',
    },
    bestFor: ['Mid-enterprise', 'Master data management', 'B2B/EDI'],
    limitations: ['Per-connector pricing adds up', 'Complex licensing'],
    pricingSource: 'https://www.vendr.com/marketplace/boomi',
    lastVerified: '2026-02-03',
  },
  
  {
    id: 'n8n',
    name: 'n8n',
    tier: 'smb',
    pricing: {
      model: 'tasks',
      hasPublicPricing: true,
      baseAnnual: 240,          // $20/mo Starter
      perUnitCost: 0.008,
      unitName: 'execution',
    },
    features: {
      selfHosted: true,         // Free self-hosted!
      embedded: false,
      apiFirst: true,
      noCodeBuilder: true,
      customConnectors: true,
      sso: true,
      auditLog: true,
      sla: null,
    },
    bestFor: ['Technical users', 'Self-hosted preference', 'Budget + control'],
    limitations: ['Less polished UX', 'Smaller connector library', 'DIY infrastructure'],
    pricingSource: 'https://n8n.io/pricing',
    lastVerified: '2026-02-03',
  },
];
```

### `src/lib/competitorComparison.ts`

```typescript
export function calculateCompetitorCost(
  competitor: CompetitorProfile,
  inputs: {
    numberOfIntegrations: number;
    monthlyApiCalls: number;
    complexity: 'low' | 'medium' | 'high';
  }
): number | null {
  // Returns estimated annual cost or null if "Contact Sales"
  
  switch (competitor.id) {
    case 'zapier':
      // Map API calls to Zapier tasks (rough: 1 API call ≈ 1-3 tasks)
      const tasksPerMonth = inputs.monthlyApiCalls * 1.5;
      return calculateZapierCost(tasksPerMonth);
      
    case 'make':
      // Make counts operations differently (1 API call ≈ 2-5 operations)
      const opsPerMonth = inputs.monthlyApiCalls * 3;
      return calculateMakeCost(opsPerMonth);
      
    case 'workato':
    case 'mulesoft':
    case 'boomi':
      // Enterprise: return base estimate with disclaimer
      return competitor.pricing.baseAnnual || null;
      
    default:
      return null;
  }
}

function calculateZapierCost(monthlyTasks: number): number {
  // Zapier pricing tiers (as of Feb 2026)
  const tiers = [
    { tasks: 750, monthly: 19.99 },
    { tasks: 2000, monthly: 49 },
    { tasks: 5000, monthly: 99 },
    { tasks: 10000, monthly: 199 },
    { tasks: 50000, monthly: 499 },
    { tasks: 100000, monthly: 799 },
    { tasks: 500000, monthly: 1199 },
    { tasks: 1000000, monthly: 1799 },
    { tasks: 2000000, monthly: 2999 },
  ];
  
  const tier = tiers.find(t => t.tasks >= monthlyTasks) || tiers[tiers.length - 1];
  return tier.monthly * 12;
}

function calculateMakeCost(monthlyOps: number): number {
  // Make pricing tiers
  const tiers = [
    { ops: 10000, monthly: 9 },
    { ops: 40000, monthly: 16 },
    { ops: 150000, monthly: 29 },
    { ops: 800000, monthly: 99 },
    // Higher tiers require Teams/Enterprise
  ];
  
  const tier = tiers.find(t => t.ops >= monthlyOps) || { ops: monthlyOps, monthly: 299 };
  return tier.monthly * 12;
}
```

---

## Implementation Tasks

### Phase 1: Data Layer (2h)
- [ ] Create `src/data/competitors.ts` with verified pricing
- [ ] Create `src/lib/competitorComparison.ts` calculation logic
- [ ] Add unit tests for cost calculations

### Phase 2: UI Components (4h)
- [ ] Create `CompetitorComparison.tsx` summary table
- [ ] Create `CompetitorDetailCard.tsx` expanded view
- [ ] Add toggle controls for selecting competitors
- [ ] Responsive design (table → cards on mobile)

### Phase 3: Integration (2h)
- [ ] Add to results page layout
- [ ] Connect to existing calculator inputs
- [ ] Add to PDF export (summary table only)

### Phase 4: Polish (2h)
- [ ] Add competitor logos (with proper attribution)
- [ ] Source citations with links
- [ ] "Last verified" dates
- [ ] Legal disclaimer text

---

## Legal & Ethical Considerations

### Must Do
- ✅ Cite all pricing sources with dates
- ✅ Use "estimated" language for enterprise pricing
- ✅ Include "Contact [Competitor] for accurate quote" CTA
- ✅ Be fair — acknowledge competitor advantages where they exist
- ✅ "Based on published pricing" disclaimer

### Must Avoid
- ❌ Claiming exact prices for quote-based products
- ❌ Outdated pricing (quarterly review needed)
- ❌ Disparaging competitors unfairly
- ❌ Using competitor trademarks inappropriately

### Disclaimer Text
```
Competitor pricing is estimated based on publicly available information
as of [date]. Actual pricing may vary based on specific requirements,
negotiated discounts, and regional factors. Contact each vendor directly
for accurate quotes. Appmixer is not affiliated with these companies.
```

---

## Success Metrics

- **Engagement:** % of users who interact with comparison section
- **PDF exports:** % including competitor comparison
- **Sales feedback:** Qualitative from sales team on usefulness
- **Accuracy:** Complaints about pricing inaccuracies (target: 0)

---

## Maintenance Plan

| Frequency | Action |
|-----------|--------|
| Monthly | Spot-check top 3 competitors (Zapier, Make, Workato) |
| Quarterly | Full pricing review of all competitors |
| On-demand | Update when competitor announces pricing changes |

---

## Open Questions

1. **Scope:** Include all 6 competitors or start with top 3?
2. **Appmixer pricing:** Currently user-provided — do we want presets?
3. **Embedded competitors:** Include Paragon/Prismatic? (different use case)
4. **Feature matrix:** How detailed? Risk of becoming outdated fast.

---

## References

- Zapier Pricing: https://zapier.com/pricing
- Make Pricing: https://make.com/en/pricing  
- Workato Guide: https://www.spendflo.com/blog/workato-pricing-guide
- MuleSoft Guide: https://cloudconsultings.com/mulesoft-pricing/
- Boomi Data: https://www.vendr.com/marketplace/boomi
- n8n Pricing: https://n8n.io/pricing
- Activepieces Zapier Analysis: https://www.activepieces.com/blog/zapier-pricing
