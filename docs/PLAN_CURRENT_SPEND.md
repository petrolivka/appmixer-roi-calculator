# Implementation Plan: Využít `currentIntegrationSpend` v kalkulacích

**Parent:** WOW_IMPROVEMENTS.md — Bod 3  
**Priority:** P1  
**Estimated effort:** 2-3 hours  
**Dependencies:** None

---

## Problem

Uživatel v kroku 3 ("Current Costs") zadá `currentIntegrationSpend` — svůj aktuální roční spend na integrace. Tato hodnota se ale **nikde nepoužívá** v kalkulačním enginu. Soubory `benefits.ts`, `roi.ts`, `buildCosts.ts` ji kompletně ignorují.

To je problém protože:
1. Zákazník vyplní číslo a očekává, že ovlivní výsledek
2. Přicházíme o silný "wow moment" — porovnání jejich reálného spendu vs. Appmixer
3. Pro zákazníky co přecházejí z jiného iPaaS je to klíčový datapoint

---

## Navrhované změny

### 1. Nový typ: `CurrentSpendComparison`

**Soubor:** `src/types/results.ts`

```typescript
export interface CurrentSpendComparison {
  currentAnnualSpend: number;        // Co zákazník zadal
  appmixerAnnualCost: number;        // Appmixer roční cost
  annualSavings: number;             // Rozdíl
  savingsPercentage: number;         // % úspora
  threeYearCurrentSpend: number;     // 3yr current
  threeYearAppmixerCost: number;     // 3yr Appmixer
  threeYearSavings: number;          // 3yr rozdíl
  hasCurrentSpend: boolean;          // Zákazník zadal spend > 0?
}
```

Přidat do `CalculationResults`:
```typescript
export interface CalculationResults {
  customBuildCosts: CustomBuildCosts;
  appmixerCosts: AppmixerCosts;
  benefits: BenefitBreakdown;
  roiMetrics: ROIMetrics;
  monthlyProjection: MonthlyDataPoint[];
  currentSpendComparison: CurrentSpendComparison;  // NEW
}
```

---

### 2. Kalkulace: `currentSpendComparison`

**Soubor:** `src/lib/calculations/currentSpend.ts` (nový)

```typescript
import type { CalculatorInputs } from "@/types/calculator";
import type { AppmixerCosts, CurrentSpendComparison } from "@/types/results";

export function calculateCurrentSpendComparison(
  inputs: CalculatorInputs,
  appmixerCosts: AppmixerCosts
): CurrentSpendComparison {
  const { currentIntegrationSpend } = inputs.currentCosts;
  const hasCurrentSpend = currentIntegrationSpend > 0;

  // Appmixer annual cost = subscription + ongoing management (no implementation in steady state)
  const appmixerAnnualCost =
    appmixerCosts.platformSubscription + appmixerCosts.ongoingManagement;

  const annualSavings = currentIntegrationSpend - appmixerAnnualCost;
  const savingsPercentage =
    currentIntegrationSpend > 0
      ? ((annualSavings / currentIntegrationSpend) * 100)
      : 0;

  // 3-year comparison (current spend stays flat, Appmixer includes year1 implementation)
  const threeYearCurrentSpend = currentIntegrationSpend * 3;
  const threeYearAppmixerCost = appmixerCosts.yearlyBreakdown.total;
  const threeYearSavings = threeYearCurrentSpend - threeYearAppmixerCost;

  return {
    currentAnnualSpend: currentIntegrationSpend,
    appmixerAnnualCost,
    annualSavings,
    savingsPercentage: Math.round(savingsPercentage),
    threeYearCurrentSpend,
    threeYearAppmixerCost,
    threeYearSavings,
    hasCurrentSpend,
  };
}
```

---

### 3. Integrace do hlavního calculation pipeline

**Soubor:** `src/lib/calculations/index.ts`

```typescript
import { calculateCurrentSpendComparison } from "./currentSpend";

export function calculateROI(inputs: CalculatorInputs): CalculationResults {
  const customBuildCosts = calculateCustomBuildCosts(inputs);
  const appmixerCosts = calculateAppmixerCosts(inputs);
  const benefits = calculateBenefits(inputs);
  const roiMetrics = calculateROIMetrics(customBuildCosts, appmixerCosts);
  const monthlyProjection = generateMonthlyProjection(customBuildCosts, appmixerCosts);
  const currentSpendComparison = calculateCurrentSpendComparison(inputs, appmixerCosts);  // NEW

  return {
    customBuildCosts,
    appmixerCosts,
    benefits,
    roiMetrics,
    monthlyProjection,
    currentSpendComparison,  // NEW
  };
}
```

---

### 4. `currentIntegrationSpend` jako alternativa k custom build estimate

**Soubor:** `src/lib/calculations/buildCosts.ts`

Pokud zákazník zadal `currentIntegrationSpend > 0` A vybral `currentIntegrationApproach !== "none"`, použít to jako **validation/context** pro custom build odhad:

```typescript
// V calculateCustomBuildCosts — přidat na konec:
// If user provided actual current spend, note the comparison
// (We don't override the calculated estimate, but it adds credibility)
```

> ⚠️ **Důležité rozhodnutí:** Nemíchat `currentIntegrationSpend` do hlavního custom build estimate. Zákazník zadává roční spend na existující řešení (může být jiný iPaaS, custom code maintenance, atd.) — to je jiná metrika než "co by stálo to celé buildovat custom". Ale zobrazit obojí vedle sebe je silný messaging.

---

### 5. Nový komponent: `CurrentSpendCard`

**Soubor:** `src/components/results/CurrentSpendCard.tsx`

Zobrazuje se **pouze pokud** zákazník zadal `currentIntegrationSpend > 0`.

```
┌──────────────────────────────────────────────────┐
│  📊 Your Current Spend vs. Appmixer               │
│                                                    │
│  Current Annual Spend        $120,000              │
│  Appmixer Annual Cost         $36,000              │
│  ─────────────────────────────────────             │
│  Annual Savings              $84,000  (70% less)   │
│                                                    │
│  ┌─────────────────────────────────────┐           │
│  │  3-Year Comparison                  │           │
│  │                                     │           │
│  │  ████████████████████  Current $360K│           │
│  │  ██████               Appmixer $125K│           │
│  │                                     │           │
│  │  You save $235K over 3 years        │           │
│  └─────────────────────────────────────┘           │
│                                                    │
│  ℹ️ Based on your reported current integration      │
│    spend of $120,000/year                          │
└──────────────────────────────────────────────────┘
```

**Chování:**
- Pokud `currentIntegrationSpend === 0` → komponent se nezobrazí
- Pokud Appmixer vychází dráž než current spend → jiný messaging: "While Appmixer may cost more than your current solution, you gain [benefits list]" — nemlčet, ale reframeovat
- Animace: čísla se animují (reuse `AnimatedNumber`)
- Horizontal bar chart pro vizuální porovnání

---

### 6. Integrace do Results Dashboard

**Soubor:** `src/app/calculator/results/page.tsx`

Přidat `CurrentSpendCard` do overview tabu, nad nebo pod stávající charts:

```tsx
<TabsContent value="overview" className="space-y-8">
  {/* NEW: Current Spend Comparison — only shows if user entered spend */}
  {results.currentSpendComparison.hasCurrentSpend && (
    <CurrentSpendCard
      comparison={results.currentSpendComparison}
      currency={inputs.currency}
    />
  )}

  <div className="grid gap-8 lg:grid-cols-2">
    <CostComparisonChart ... />
    <BreakEvenChart ... />
  </div>
  <BenefitBreakdownChart ... />
</TabsContent>
```

---

### 7. Rozšířit HeroMetrics o "vs. Current Spend" context

**Soubor:** `src/components/results/HeroMetrics.tsx`

Pokud `hasCurrentSpend`, přidat pod "3-Year Savings" kartu drobný kontext:

```tsx
// Pod savings description
{currentSpendComparison?.hasCurrentSpend && (
  <p className="mt-1 text-xs text-emerald-600 font-medium">
    {currentSpendComparison.savingsPercentage}% less than your current spend
  </p>
)}
```

---

### 8. Přidat do CostBreakdownTable

**Soubor:** `src/components/results/CostBreakdownTable.tsx`

Pokud `hasCurrentSpend`, přidat třetí sloupec/sekci "Your Current Spend" vedle Custom Build a Appmixer:

```
┌──────────────────┬──────────────────┬──────────────────┐
│  Current Spend   │  Custom Build    │  Appmixer        │
│  (your actual)   │  (estimated)     │  (projected)     │
├──────────────────┼──────────────────┼──────────────────┤
│  $120,000/yr     │  $85,000 Init    │  $22,500 Impl    │
│                  │  $21,250 Maint   │  $11,988 Sub     │
│                  │  $12,000 Infra   │  $800 Mgmt       │
│                  │  $38,400 DevTime │                  │
├──────────────────┼──────────────────┼──────────────────┤
│  $360,000 (3yr)  │  $454,000 (3yr)  │  $60,776 (3yr)  │
└──────────────────┴──────────────────┴──────────────────┘
```

Třísloupkový layout se zobrazí jen když `hasCurrentSpend`. Jinak zůstane stávající dvousloupkový.

---

### 9. Přidat do PDF reportu

**Soubor:** `src/lib/pdf/generateReport.tsx`

Přidat sekci "Current Spend Analysis" pokud `hasCurrentSpend`:
- Tabulka: Current vs. Appmixer (roční + 3-leté)
- Headline: "Switching from your current solution saves you X% annually"

---

### 10. Preview Panel update

**Soubor:** `src/components/calculator/PreviewPanel.tsx`

Na step 3, po vyplnění current spend, zobrazit v live preview:

```tsx
{currentSpendComparison?.hasCurrentSpend && (
  <>
    <Separator />
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
        <ArrowDown className="h-5 w-5 text-orange-600" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">vs. Current Spend</p>
        <p className="text-xl font-bold text-orange-600">
          {comparison.savingsPercentage}% less
        </p>
      </div>
    </div>
  </>
)}
```

---

## Testy

### `src/lib/calculations/currentSpend.test.ts`
```
✓ Returns hasCurrentSpend: false when spend is 0
✓ Returns hasCurrentSpend: true when spend > 0
✓ Calculates annual savings correctly
✓ Calculates savings percentage correctly
✓ Handles case where Appmixer costs more than current spend (negative savings)
✓ Calculates 3-year comparison correctly
✓ 3-year Appmixer includes implementation cost in year 1
```

### Update `src/lib/calculations/index.test.ts`
```
✓ calculateROI returns currentSpendComparison
✓ currentSpendComparison matches expected values for default inputs
```

---

## Edge cases

| Scenario | Behavior |
|----------|----------|
| `currentIntegrationSpend = 0` | `hasCurrentSpend: false`, card hidden |
| Appmixer dražší než current spend | Show card with reframed messaging: "While switching costs more, you gain: faster integrations, lower maintenance, better reliability" |
| Very high current spend (outlier) | No cap — let the numbers speak. Pokud savings > 90%, přidat note "This looks like a significant opportunity" |
| `currentIntegrationApproach = "none"` | Still show if they entered spend > 0 (maybe they have scattered costs) |

---

## File change summary

| File | Action | Effort |
|------|--------|--------|
| `src/types/results.ts` | Add `CurrentSpendComparison` interface | 5 min |
| `src/lib/calculations/currentSpend.ts` | **New file** — calculation logic | 20 min |
| `src/lib/calculations/currentSpend.test.ts` | **New file** — tests | 20 min |
| `src/lib/calculations/index.ts` | Wire up new calculation | 5 min |
| `src/lib/calculations/index.test.ts` | Update for new field | 10 min |
| `src/components/results/CurrentSpendCard.tsx` | **New file** — UI component | 45 min |
| `src/app/calculator/results/page.tsx` | Add CurrentSpendCard to layout | 10 min |
| `src/components/results/HeroMetrics.tsx` | Add "vs current" context line | 10 min |
| `src/components/results/CostBreakdownTable.tsx` | Add 3rd column when available | 30 min |
| `src/components/calculator/PreviewPanel.tsx` | Add current spend preview | 15 min |
| `src/lib/pdf/generateReport.tsx` | Add current spend section | 20 min |

**Total: ~3 hours**

---

## Rollout order

1. `results.ts` — typy
2. `currentSpend.ts` + testy — kalkulace
3. `index.ts` — propojení
4. `CurrentSpendCard.tsx` — hlavní nový UI
5. `results/page.tsx` — integrace do dashboardu
6. `HeroMetrics.tsx` — context line
7. `CostBreakdownTable.tsx` — 3-column layout
8. `PreviewPanel.tsx` — live preview
9. `generateReport.tsx` — PDF
10. Manuální test celého flow
