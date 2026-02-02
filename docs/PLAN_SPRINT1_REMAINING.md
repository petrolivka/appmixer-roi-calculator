# Implementation Plan: Sprint 1 — Remaining Items

**Date:** 2026-02-02  
**Scope:** Lead Capture, Celebration Animation, Self-Hosted Toggle, CFO Share Template  
**Estimated total effort:** ~6-8 hours  

---

## 1. Lead Capture (Email Report)

**Impact: 🔴 Critical | Effort: ~3h**

### Problém
PDF se generuje čistě client-side a automaticky stahuje. Žádný lead capture = žádná hodnota pro sales. Tohle je hlavní důvod existence ROI kalkulátoru jako sales toolu.

### Řešení: Client-side modal + serverless API route

Přístup bez externího backendu — Next.js API route (nebo server action) pošle email přes Resend/SendGrid/SMTP a volitelně pushne lead do CRM.

### Nové soubory

#### `src/components/results/LeadCaptureModal.tsx`
Modal dialog s formulářem, který se zobrazí místo okamžitého stažení PDF.

```
┌──────────────────────────────────────────┐
│  📄 Get Your ROI Report                  │
│                                          │
│  Name     [________________]             │
│  Email    [________________]             │
│  Company  [________________] (optional)  │
│  Role     [________________] (optional)  │
│                                          │
│  ☐ Send me integration tips & updates    │
│                                          │
│  [Download PDF]    [Email me the report] │
│                                          │
│  Skip — just download ↗                  │
└──────────────────────────────────────────┘
```

**Chování:**
- "Download PDF" → stáhne PDF + odešle lead data na API
- "Email me the report" → odešle PDF na email + uloží lead
- "Skip — just download" → stáhne PDF bez lead capture (neblokovat uživatele)
- Po úspěšném submitu: "Check your inbox!" success state
- Validace: Zod schema pro email, jméno required

**UI:** Radix Dialog (už máme @radix-ui závislosti, ale potřebujeme přidat `@radix-ui/react-dialog`)

```typescript
interface LeadData {
  name: string;
  email: string;
  company?: string;
  role?: string;
  optInMarketing: boolean;
  roiPercentage: number;
  threeYearSavings: number;
  companySize: string;
  numberOfIntegrations: number;
}
```

#### `src/app/api/lead/route.ts`
Next.js API Route pro zpracování leadu.

```typescript
// POST /api/lead
// Body: LeadData
// Actions:
//   1. Validate with Zod
//   2. Send email with PDF attachment (optional — Resend API)
//   3. Push to CRM webhook (optional — Freshdesk/HubSpot)
//   4. Return { success: true }
```

**Varianty implementace (od nejjednoduššího):**

| Varianta | Popis | Effort |
|----------|-------|--------|
| A. Webhook only | POST lead data na webhook URL (Zapier/Make/n8n → CRM) | 30 min |
| B. Resend email | Resend API pro email + webhook | 1h |
| C. Full CRM | Resend + přímý Freshdesk/HubSpot API push | 2h |

**Doporučení:** Začít variantou A (webhook) — nejrychlejší, CRM integrace se řeší na straně webhook automation. API route jen validuje a forwarduje.

#### `src/lib/constants/leadConfig.ts`
```typescript
export const LEAD_CONFIG = {
  webhookUrl: process.env.LEAD_WEBHOOK_URL || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  enableEmailDelivery: false, // Phase 2
  requiredFields: ["name", "email"] as const,
};
```

### Úpravy existujících souborů

#### `src/components/results/ActionButtons.tsx`
- "Download PDF Report" → otevře LeadCaptureModal místo přímého stažení
- Přidat prop `onLeadCapture` vedle `onDownloadPdf`

#### `src/app/calculator/results/page.tsx`
- Přidat stav pro modal (`showLeadModal`)
- Wire up modal → PDF generation flow

#### `package.json`
- Přidat: `@radix-ui/react-dialog`
- Volitelně: `resend` (pokud varianta B/C)

#### `.env.local` (nový)
```
LEAD_WEBHOOK_URL=https://hooks.zapier.com/...
# RESEND_API_KEY=re_... (Phase 2)
```

### Test
- Modal se zobrazí po kliknutí na "Download PDF"
- "Skip" stáhne PDF normálně
- Form validace funguje (email required)
- API route vrací 200 s validním payloadem
- API route vrací 400 s invalidním payloadem

---

## 2. Celebration Animation

**Impact: Medium | Effort: ~1h**

### Řešení: Canvas confetti + CSS glow

### Nové soubory

#### `src/components/results/Celebration.tsx`
```typescript
"use client";

import { useEffect, useRef } from "react";

interface CelebrationProps {
  roiPercentage: number;
  trigger: boolean;  // fire once when results load
}

// Threshold: celebrate when ROI > 200%
const ROI_CELEBRATION_THRESHOLD = 200;

export function Celebration({ roiPercentage, trigger }: CelebrationProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (!trigger || fired.current) return;
    if (roiPercentage < ROI_CELEBRATION_THRESHOLD) return;
    fired.current = true;

    // Dynamic import to keep bundle small
    import("canvas-confetti").then((confetti) => {
      // Burst from both sides
      const defaults = { spread: 60, ticks: 80, gravity: 1.2, decay: 0.94 };
      confetti.default({ ...defaults, particleCount: 40, origin: { x: 0.2, y: 0.6 } });
      confetti.default({ ...defaults, particleCount: 40, origin: { x: 0.8, y: 0.6 } });

      // Second wave
      setTimeout(() => {
        confetti.default({ ...defaults, particleCount: 25, origin: { x: 0.5, y: 0.4 }, spread: 90 });
      }, 200);
    });
  }, [trigger, roiPercentage]);

  return null; // No DOM — canvas-confetti creates its own canvas
}
```

### Úpravy existujících souborů

#### `src/app/calculator/results/page.tsx`
```tsx
import { Celebration } from "@/components/results/Celebration";

// In ResultsContent, po results calculation:
<Celebration roiPercentage={results.roiMetrics.roiPercentage} trigger={true} />
```

#### `src/components/results/HeroMetrics.tsx`
Přidat glow efekt na ROI kartu při vysokém ROI:

```tsx
// ROI card: conditional glow class
className={`h-full ${
  metrics.roiPercentage > 200
    ? "ring-2 ring-primary/30 shadow-lg shadow-primary/20 animate-glow"
    : ""
}`}
```

#### `src/app/globals.css`
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 15px 0 rgba(243, 21, 60, 0.15); }
  50% { box-shadow: 0 0 25px 5px rgba(243, 21, 60, 0.25); }
}
.animate-glow {
  animation: glow 2s ease-in-out 3; /* 3 pulses then stop */
}
```

#### `package.json`
- Přidat: `canvas-confetti` (3KB gzipped, zero deps)
- Přidat: `@types/canvas-confetti` (devDeps)

### Chování
| ROI | Efekt |
|-----|-------|
| < 200% | Žádná animace |
| 200-500% | Confetti burst + glow pulse (3x) |
| > 500% | Větší confetti (více particles) + delší glow |

### Test
- Vizuální — manuální kontrola
- Unit test: `Celebration` component necrashuje při ROI < threshold
- Unit test: `Celebration` component necrashuje při ROI > threshold

---

## 3. Self-Hosted Toggle Logic

**Impact: Medium | Effort: ~1.5h**

### Problém
`selfHostedRequired` toggle existuje v `IntegrationRequirements.tsx`, ale `appmixerCosts.ts` ho kompletně ignoruje. Zákazník ho přepne a nic se nestane.

### Řešení

Self-hosted deployment přidává infrastructure cost, ale eliminuje cloud subscription premium a dává compliance benefity.

### Nové konstanty

#### `src/lib/constants/benchmarks.ts` — rozšířit
```typescript
export const SELF_HOSTED_COSTS = {
  // Monthly infrastructure cost for self-hosted Appmixer
  monthlyInfrastructure: {
    smb: 800,        // Small K8s cluster or docker-compose
    "mid-market": 1500,  // Multi-node K8s
    enterprise: 3000,    // HA cluster, multiple environments
  },
  // One-time setup cost multiplier (on top of implementation)
  setupMultiplier: 1.5,  // 50% more implementation effort for self-hosted
  // Management overhead multiplier (vs cloud)
  managementMultiplier: 2.5,  // Self-hosted needs more hands-on management
} as const;

export const SELF_HOSTED_BENEFITS = {
  // Compliance cost avoidance (annual) — particularly for regulated industries
  complianceSavings: {
    saas: 0,
    fintech: 50000,      // SOC2, PCI-DSS related
    healthtech: 75000,   // HIPAA, data residency
    ecommerce: 10000,    // PCI related
    logistics: 5000,
    manufacturing: 10000,
    other: 5000,
  },
  // Vendor lock-in risk avoidance (annual estimated value)
  vendorLockInAvoidance: 15000,
} as const;
```

### Úpravy existujících souborů

#### `src/types/results.ts` — rozšířit `AppmixerCosts`
```typescript
export interface AppmixerCosts {
  platformSubscription: number;
  implementationCost: number;
  ongoingManagement: number;
  selfHostedInfrastructure: number;  // NEW — 0 if cloud
  yearlyBreakdown: YearlyCosts;
}
```

#### `src/lib/calculations/appmixerCosts.ts`
```typescript
import { SELF_HOSTED_COSTS } from "@/lib/constants/benchmarks";

export function calculateAppmixerCosts(inputs: CalculatorInputs): AppmixerCosts {
  const { selfHostedRequired } = integrationRequirements;
  const { companySize } = companyProfile;

  // ... existing code ...

  // Self-hosted adjustments
  let selfHostedInfrastructure = 0;
  if (selfHostedRequired) {
    // Additional implementation effort for self-hosted setup
    implementationCost *= SELF_HOSTED_COSTS.setupMultiplier;

    // Monthly infrastructure cost
    selfHostedInfrastructure =
      SELF_HOSTED_COSTS.monthlyInfrastructure[companySize] * 12;

    // More management overhead for self-hosted
    ongoingManagement *= SELF_HOSTED_COSTS.managementMultiplier;
  }

  // Year 1: Implementation + subscription + management + infra
  const year1 = implementationCost + platformSubscription
    + ongoingManagement + selfHostedInfrastructure;

  // Year 2 & 3: Subscription + management + infra
  const year2 = platformSubscription + ongoingManagement + selfHostedInfrastructure;
  const year3 = platformSubscription + ongoingManagement + selfHostedInfrastructure;

  return {
    platformSubscription,
    implementationCost,
    ongoingManagement,
    selfHostedInfrastructure,  // NEW
    yearlyBreakdown: { year1, year2, year3, total: year1 + year2 + year3 },
  };
}
```

#### `src/lib/calculations/benefits.ts` — přidat self-hosted benefity
```typescript
// At end of calculateBenefits, if selfHostedRequired:
let complianceSavings = 0;
let vendorLockInAvoidance = 0;
if (integrationRequirements.selfHostedRequired) {
  complianceSavings =
    SELF_HOSTED_BENEFITS.complianceSavings[companyProfile.industryVertical] || 0;
  vendorLockInAvoidance = SELF_HOSTED_BENEFITS.vendorLockInAvoidance;
}
```

#### `src/types/results.ts` — rozšířit `BenefitBreakdown`
```typescript
export interface BenefitBreakdown {
  // ... existing ...
  complianceSavings: number;      // NEW
  vendorLockInAvoidance: number;  // NEW
  total: number;
}
```

#### `src/components/results/CostBreakdownTable.tsx`
- Přidat řádek "Self-Hosted Infrastructure" do Appmixer tabulky (pokud > 0)

#### `src/components/results/BenefitBreakdownChart.tsx`
- Přidat nové benefit kategorie do `BENEFIT_LABELS`

### Test
- `appmixerCosts.test.ts`: self-hosted = false → `selfHostedInfrastructure === 0`
- `appmixerCosts.test.ts`: self-hosted = true → `selfHostedInfrastructure > 0`, vyšší implementation cost
- `benefits.test.ts`: self-hosted + fintech → `complianceSavings === 50000`
- `benefits.test.ts`: self-hosted + saas → `complianceSavings === 0`
- `index.test.ts`: update pro nové fields

---

## 4. CFO Share Template

**Impact: Medium | Effort: ~1.5h**

### Problém
Stávající "Share Results" zkopíruje URL nebo otevře native share. Chybí kontextový share flow pro interní decision-making — CFO/VP potřebuje vidět čísla v emailu, ne klikat na link.

### Řešení: Share dropdown s pre-filled templates

### Nové soubory

#### `src/components/results/ShareMenu.tsx`
Dropdown s možnostmi sdílení.

```
┌────────────────────────────────────────┐
│  Share Results                    ▼    │
├────────────────────────────────────────┤
│  📧 Email to Stakeholder              │
│  💬 Copy as Slack Message             │
│  🔗 Copy Link                         │
│  📋 Copy Summary Text                 │
└────────────────────────────────────────┘
```

#### `src/lib/shareTemplates.ts`
Template generátory.

```typescript
import type { CalculationResults } from "@/types/results";
import type { CalculatorInputs } from "@/types/calculator";
import { formatCurrency } from "./currency";

export function generateEmailTemplate(
  inputs: CalculatorInputs,
  results: CalculationResults,
  url: string
): { subject: string; body: string } {
  const { roiMetrics } = results;
  const { currency } = inputs;
  const fmt = (v: number) => formatCurrency(v, currency);

  return {
    subject: `Integration Platform ROI Analysis — ${roiMetrics.roiPercentage}% projected ROI`,
    body: `Hi,

I ran an ROI analysis for adopting an integration platform (Appmixer) vs. our current approach. Here are the key findings:

KEY METRICS:
• Projected ROI: ${roiMetrics.roiPercentage}%
• 3-Year Savings: ${fmt(roiMetrics.threeYearSavings)}
• Payback Period: ${roiMetrics.paybackPeriodMonths.toFixed(1)} months
• Break-Even: Month ${roiMetrics.breakEvenMonth}

COST COMPARISON (3 Years):
• Custom Build: ${fmt(results.customBuildCosts.yearlyBreakdown.total)}
• Appmixer: ${fmt(results.appmixerCosts.yearlyBreakdown.total)}

Interactive results: ${url}

I think this is worth discussing. Let me know when you have time to review.

Best regards`,
  };
}

export function generateSlackMessage(
  inputs: CalculatorInputs,
  results: CalculationResults,
  url: string
): string {
  const { roiMetrics } = results;
  const { currency } = inputs;
  const fmt = (v: number) => formatCurrency(v, currency, { compact: true });

  return `📊 *Integration Platform ROI Analysis*

*${roiMetrics.roiPercentage}% ROI* | *${fmt(roiMetrics.threeYearSavings)} savings* (3yr) | *${roiMetrics.paybackPeriodMonths.toFixed(1)} mo* payback

Custom Build: ${fmt(results.customBuildCosts.yearlyBreakdown.total)} → Appmixer: ${fmt(results.appmixerCosts.yearlyBreakdown.total)}

<${url}|View interactive results>`;
}

export function generateSummaryText(
  inputs: CalculatorInputs,
  results: CalculationResults
): string {
  const { roiMetrics } = results;
  const { currency } = inputs;
  const fmt = (v: number) => formatCurrency(v, currency);

  return `ROI: ${roiMetrics.roiPercentage}% | Savings: ${fmt(roiMetrics.threeYearSavings)} (3yr) | Payback: ${roiMetrics.paybackPeriodMonths.toFixed(1)} months | Break-even: Month ${roiMetrics.breakEvenMonth}`;
}
```

### Úpravy existujících souborů

#### `src/components/results/ActionButtons.tsx`
Nahradit stávající "Share Results" button za `ShareMenu` dropdown.

```typescript
interface ActionButtonsProps {
  onDownloadPdf: () => void;
  onShare: () => void;        // keep for backward compat
  onEmailShare: () => void;   // NEW — opens mailto:
  onSlackCopy: () => void;    // NEW — copies Slack format
  onSummaryCopy: () => void;  // NEW — copies plain text
  isGeneratingPdf?: boolean;
}
```

Alternativa (jednodušší): Místo nových props, předat `inputs` a `results` přímo do `ActionButtons` a handlery řešit interně.

#### Implementace v `ActionButtons.tsx`

```tsx
// Replace Share button with dropdown
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="w-full">
      <Share2 className="mr-2 h-4 w-4" />
      Share Results
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem onClick={handleEmailShare}>
      <Mail className="mr-2 h-4 w-4" />
      Email to Stakeholder
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleSlackCopy}>
      <MessageSquare className="mr-2 h-4 w-4" />
      Copy as Slack Message
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleCopyLink}>
      <Link2 className="mr-2 h-4 w-4" />
      Copy Link
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleCopySummary}>
      <ClipboardCopy className="mr-2 h-4 w-4" />
      Copy Summary
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Email share handler:**
```typescript
const handleEmailShare = () => {
  const { subject, body } = generateEmailTemplate(inputs, results, window.location.href);
  window.open(
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  );
};
```

**Slack copy handler:**
```typescript
const handleSlackCopy = async () => {
  const text = generateSlackMessage(inputs, results, window.location.href);
  await navigator.clipboard.writeText(text);
  toast("Copied for Slack!"); // or simple alert
};
```

#### `package.json`
- Přidat: `@radix-ui/react-dropdown-menu`

### Test
- `shareTemplates.test.ts`:
  - Email template contains ROI %, savings, URL
  - Slack message contains markdown formatting
  - Summary text is single line
  - All templates handle different currencies
- Manuální: mailto link se správně otevře v email klientu

---

## Souhrn — Sprint 1 Remaining

| # | Feature | Nové soubory | Upravené soubory | Nové deps | Effort |
|---|---------|-------------|-----------------|-----------|--------|
| 1 | Lead Capture | `LeadCaptureModal.tsx`, `api/lead/route.ts`, `leadConfig.ts` | `ActionButtons.tsx`, `results/page.tsx`, `package.json` | `@radix-ui/react-dialog` | 3h |
| 2 | Celebration | `Celebration.tsx` | `results/page.tsx`, `HeroMetrics.tsx`, `globals.css`, `package.json` | `canvas-confetti` | 1h |
| 3 | Self-Hosted | — | `benchmarks.ts`, `appmixerCosts.ts`, `benefits.ts`, `results.ts`, `calculator.ts`, `CostBreakdownTable.tsx`, `BenefitBreakdownChart.tsx` + testy | — | 1.5h |
| 4 | CFO Share | `ShareMenu.tsx`, `shareTemplates.ts` | `ActionButtons.tsx`, `results/page.tsx`, `package.json` | `@radix-ui/react-dropdown-menu` | 1.5h |

**Celkem: ~7h**

### Doporučený rollout order
1. **Self-Hosted Toggle** (1.5h) — čistě kalkulační, žádné nové deps, izolovaný
2. **Celebration Animation** (1h) — rychlý wow efekt, 1 nový dep
3. **CFO Share Template** (1.5h) — nový UI pattern (dropdown), share templates
4. **Lead Capture** (3h) — nejvíc práce, potřebuje API route + modal + env config

### Poznámky
- Lead Capture je critical z business pohledu, ale technicky nejsložitější — závisí na rozhodnutí o CRM integrace (webhook vs. Resend vs. přímý API)
- Celebration + Self-Hosted jsou nezávislé, můžou jít paralelně
- Všechny 4 features jsou navzájem nezávislé — žádné cross-dependencies
