# Implementation Plan: Quick Mode ("30-Second Estimate")

**Parent:** WOW_IMPROVEMENTS.md — Bod 2  
**Priority:** P2  
**Estimated effort:** 4-6 hours  
**Dependencies:** None (standalone feature)

---

## Concept

Nová alternativní cesta k výsledkům — zákazník zadá 3 vstupy a do 30 sekund vidí odhad ROI. Cíl: snížit bounce rate, chytit busy CTO/VP, kteří nechtějí vyplňovat 3-step wizard.

**User flow:**
1. Landing page: nový CTA "Quick Estimate — 30 seconds" vedle "Start Full Calculator"
2. Single-page form: 3 inputy na jedné obrazovce
3. Instant results: zjednodušený dashboard s CTA "Want more detail? Run the full calculator"

---

## Nové soubory

### 1. `src/app/calculator/quick/page.tsx`
Nová route — quick calculator page.

```
Struktura:
- Header (logo + link na full calculator)
- Headline: "Get Your ROI Estimate in 30 Seconds"
- 3 inputy vedle sebe (nebo stacked na mobile)
- Animated results panel (živě se updatuje při změně inputů)
- CTA sekce
```

### 2. `src/components/calculator/QuickCalculator.tsx`
Hlavní komponenta quick mode.

**3 inputy:**
| Input | Type | Default | Mapping |
|-------|------|---------|---------|
| Company Size | 3 big buttons (SMB / Mid-Market / Enterprise) | Mid-Market | `companyProfile.companySize` |
| Number of Integrations | Slider (1-50) | 10 | `integrationRequirements.numberOfIntegrations` |
| Integration Complexity | 3 buttons (Simple / Medium / Complex) | Medium | `integrationRequirements.integrationComplexity` |

**Smart defaults pro zbylé hodnoty:**
```typescript
const QUICK_DEFAULTS: Record<CompanySize, Partial<CalculatorInputs>> = {
  smb: {
    companyProfile: {
      companySize: "smb",
      industryVertical: "saas",
      numberOfDevelopers: 5,
      developerHourlyCost: 60,
      currentIntegrationApproach: "custom-code",
    },
    integrationRequirements: {
      // numberOfIntegrations a integrationComplexity z inputů
      endUserFacing: true,
      expectedMonthlyApiCalls: 50000,
      selfHostedRequired: false,
      appmixerMonthlyCost: 499,
    },
    currentCosts: {
      currentIntegrationSpend: 0,
      devHoursOnIntegrationPerMonth: 20,
      integrationIncidentsPerMonth: 3,
    },
    currency: "USD",
  },
  "mid-market": {
    companyProfile: {
      companySize: "mid-market",
      industryVertical: "saas",
      numberOfDevelopers: 10,
      developerHourlyCost: 80,
      currentIntegrationApproach: "custom-code",
    },
    integrationRequirements: {
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
    currency: "USD",
  },
  enterprise: {
    companyProfile: {
      companySize: "enterprise",
      industryVertical: "saas",
      numberOfDevelopers: 25,
      developerHourlyCost: 120,
      currentIntegrationApproach: "custom-code",
    },
    integrationRequirements: {
      endUserFacing: true,
      expectedMonthlyApiCalls: 500000,
      selfHostedRequired: false,
      appmixerMonthlyCost: 2499,
    },
    currentCosts: {
      currentIntegrationSpend: 0,
      devHoursOnIntegrationPerMonth: 80,
      integrationIncidentsPerMonth: 10,
    },
    currency: "USD",
  },
};
```

### 3. `src/components/calculator/QuickResults.tsx`
Zjednodušený results panel — zobrazuje se VEDLE nebo POD inputy (ne na nové stránce).

**Zobrazuje:**
- ROI % (velký, animovaný)
- 3-Year Savings (velký, animovaný)
- Payback period
- Jednoduchý bar chart: Custom Build vs. Appmixer (jednoroční)

**CTAs:**
- "Run Full Calculator" → `/calculator` s pre-filled daty z quick mode
- "Download Quick Report" → zjednodušený PDF
- "Schedule a Demo" → externí odkaz

### 4. `src/lib/constants/quickDefaults.ts`
Centralizované smart defaults per company size (výše popsaný objekt).

---

## Úpravy existujících souborů

### `src/app/page.tsx` (Landing page)
- Přidat druhý CTA button vedle "Start Calculator":
  ```tsx
  <div className="flex gap-4 justify-center">
    <Link href="/calculator" className="...primary button...">
      Full Calculator
    </Link>
    <Link href="/calculator/quick" className="...outline button...">
      Quick Estimate — 30 seconds ⚡
    </Link>
  </div>
  ```

### `src/app/calculator/page.tsx`
- Přidat banner/link nahoře: "Short on time? Try our Quick Estimate →"

### `src/hooks/useCalculator.ts`
- Přidat `initFromQuick(quickData)` action do reduceru
- Umožní "Run Full Calculator" předvyplnit wizard daty z quick mode

---

## UX Design Notes

### Layout (Desktop)
```
┌─────────────────────────────────────────────────┐
│  Header: Logo          "Full Calculator →"       │
├─────────────────────────────────────────────────┤
│                                                  │
│   Get Your ROI Estimate in 30 Seconds ⚡         │
│                                                  │
│  ┌──────────┐  ┌─────────────┐  ┌──────────┐   │
│  │   SMB    │  │ [Mid-Market]│  │Enterprise│   │
│  └──────────┘  └─────────────┘  └──────────┘   │
│                                                  │
│  Integrations:  ◄━━━━━━━●━━━━━━━━►  10          │
│                                                  │
│  ┌──────────┐  ┌─────────────┐  ┌──────────┐   │
│  │  Simple  │  │  [Medium]   │  │ Complex  │   │
│  └──────────┘  └─────────────┘  └──────────┘   │
│                                                  │
│  ═══════════════════════════════════════════════ │
│                                                  │
│    🚀 342% ROI     💰 $485K Saved    ⏱ 3.2 mo   │
│                                                  │
│    ████████████████████  Custom Build: $680K     │
│    ███████               Appmixer:    $195K     │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │ Full Calculator → │  │ Schedule a Demo 📞   │ │
│  └──────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Layout (Mobile)
- Všechno stacked vertikálně
- Results panel se animuje zespoda po výběru company size
- Sticky CTA bar na bottom

### Animace
- Results panel: fade in + slide up při prvním zobrazení
- Čísla: `AnimatedNumber` component (už existuje v `HeroMetrics.tsx`)
- Bar chart: grow animation zleva
- Při změně inputů: smooth transition na číslech

---

## Přechod Quick → Full Calculator

Když uživatel klikne "Run Full Calculator":
1. Zakódovat quick data do URL params (stejný mechanismus jako výsledky)
2. Redirect na `/calculator?quick=<base64>`
3. Wizard se otevře na step 1 s pre-filled daty
4. Banner: "We've pre-filled based on your quick estimate. Review and adjust for more accurate results."

```typescript
// In QuickCalculator.tsx
const handleRunFull = () => {
  const params = new URLSearchParams({
    quick: btoa(JSON.stringify({
      companySize: selectedSize,
      numberOfIntegrations,
      integrationComplexity: selectedComplexity,
    })),
  });
  router.push(`/calculator?${params.toString()}`);
};
```

```typescript
// In WizardContainer.tsx — detect quick params
const searchParams = useSearchParams();
const quickParam = searchParams.get("quick");
// If present, merge with defaults and show info banner
```

---

## Testy

### `src/components/calculator/QuickCalculator.test.tsx`
- Renders 3 input groups
- Company size selection updates defaults
- Slider changes number of integrations
- Complexity selection works
- Results update live

### `src/lib/constants/quickDefaults.test.ts`
- All company sizes have valid complete CalculatorInputs
- Defaults produce reasonable ROI (positive, < 1000%)

---

## Rollout

1. Implement `quickDefaults.ts` + tests
2. Implement `QuickCalculator.tsx` + `QuickResults.tsx`
3. Create `/calculator/quick/page.tsx`
4. Update landing page with dual CTA
5. Add quick→full transition in `WizardContainer.tsx`
6. Add "Short on time?" link in full calculator header
