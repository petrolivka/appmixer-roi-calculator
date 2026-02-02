# ROI Calculator — Customer Wow Effect Improvements

**Date:** 2026-02-02  
**Status:** Proposal  

---

## Current State Summary

Solid MVP with 3-step wizard, results dashboard (hero metrics, charts, sensitivity analysis), PDF export, share functionality, and methodology page. Tech: Next.js 16, React 19, TypeScript, Tailwind, Recharts, Framer Motion.

---

## Identified Improvements

### 1. Lead Capture (Email Report)
**Impact: 🔴 Critical | Effort: Low**

PDF se generuje client-side bez jakéhokoliv lead capture. Tohle je hlavní sales value celého toolu.

**Návrh:**
- "Email me the report" modal → jméno + email + volitelně company
- Backend endpoint (nebo 3rd party form service) pro odeslání emailu s PDF přílohou
- Automatický push do CRM (HubSpot/Freshdesk)
- Tracking: kolik lidí si nechá poslat report = qualified lead metric

---

### 2. Quick Mode ("30-Second Estimate")
**Impact: High | Effort: Medium**

Pro busy CTO/VP — stačí 3 inputy a okamžitý výsledek.

**Návrh:**
- Landing page: "Get your ROI in 30 seconds" CTA vedle plného kalkulátoru
- Vstupy: # integrations, complexity, company size → smart defaults pro zbytek
- Výsledek: zjednodušená results page s CTA "Want more detail? Run the full calculator"
- Nová route: `/calculator/quick`

---

### 3. Využít `currentIntegrationSpend` v kalkulacích
**Impact: High | Effort: Low**

Uživatel zadá svůj aktuální roční spend na integrace, ale nikde se to nepočítá — `benefits.ts` ani `roi.ts` ho nepoužívají.

**Návrh:**
- Porovnat actual spend vs. Appmixer cost: "You're currently spending $120K/year, with Appmixer you'd spend $36K"
- Přidat do results dashboardu "Current Spend vs. Appmixer" metriku
- Zahrnout do PDF reportu jako "Your Current Situation" sekci

**Soubory k úpravě:** `benefits.ts`, `roi.ts`, `HeroMetrics.tsx`, `CostBreakdownTable.tsx`

---

### 4. Industry-Specific Benchmarks
**Impact: High | Effort: Medium**

Industry vertical se sbírá v Company Profile, ale kalkulačka ho prakticky ignoruje — benchmarky jsou pro všechny stejné.

**Návrh:**
- Industry-specific multipliers v `benchmarks.ts`:
  - FinTech: +20% compliance costs, higher incident cost ($800)
  - HealthTech: +30% compliance, HIPAA overhead
  - E-commerce: higher API volume, seasonal spikes
  - SaaS: end-user facing emphasis, churn impact higher
- Case study snippets na results page: "FinTech companies like yours typically save 40% more on compliance-related integrations"
- Relevantní customer loga podle industry

**Soubory k úpravě:** `benchmarks.ts`, `benefits.ts`, `buildCosts.ts`, nový `industryProfiles.ts`

---

### 5. Personalized Results Narrative
**Impact: High | Effort: Medium**

Results page je stejná pro všechny — chybí personalizace a kontext.

**Návrh:**
- Personalized headline: "As a mid-market SaaS company with 20 integrations, your projected ROI is exceptional"
- Kontextové doporučení: "Given your complex integrations and high API volume, we recommend our Enterprise tier"
- Risk/confidence score: "High confidence — your profile matches 85% of companies seeing similar ROI"
- Top 3 "biggest savings drivers" highlighted

**Nový komponent:** `PersonalizedSummary.tsx`

---

### 6. Celebration Animation
**Impact: Medium | Effort: Low**

Výsledky se zobrazí s AnimatedNumber, ale chybí emotional punch.

**Návrh:**
- Confetti animace při ROI > 200% (knihovna: `canvas-confetti` nebo `react-confetti`)
- Gradient glow/pulse efekt na hero metrics kartách
- Animated savings counter "ticking up" efekt
- Sound? (volitelný, defaultně off)

**Soubory k úpravě:** `HeroMetrics.tsx`, results `page.tsx`

---

### 7. Self-Hosted Toggle Logic
**Impact: Medium | Effort: Low**

Self-hosted toggle je v UI (`IntegrationRequirements.tsx`), ale `appmixerCosts.ts` ho kompletně ignoruje.

**Návrh:**
- Self-hosted: +$500-2,000/month infrastructure cost na Appmixer straně
- Ale: eliminuje vendor lock-in risk, compliance benefit
- Messaging: "Self-hosted adds infrastructure cost but provides full data sovereignty"
- Security/compliance benefit kvantifikace (zejména pro FinTech/HealthTech)

**Soubory k úpravě:** `appmixerCosts.ts`, `benefits.ts`

---

### 8. Competitor Comparison
**Impact: Medium | Effort: High**

PRD zmiňuje že SnapLogic, TIBCO, Informatica mají ROI tools. Chybí srovnání.

**Návrh:**
- "What if you chose MuleSoft / Workato / Zapier instead?" tab/sekce
- Veřejně dostupné pricing tiers konkurentů
- Appmixer vychází lépe na ceně (especially self-hosted, embedded use case)
- Tabulka: Appmixer vs. MuleSoft vs. Workato — cost, features, flexibility

**Pozor:** Musí být fakticky přesné, neagresivní. "Based on published pricing" disclaimer.

**Nové soubory:** `competitorPricing.ts`, `CompetitorComparison.tsx`

---

### 9. Interactive Story Flow
**Impact: Medium | Effort: High**

Místo statického dashboardu — narrated scroll experience.

**Návrh:**
- Scroll-driven sections:
  1. "Here's your situation today" (current costs visualized)
  2. "Here's what building custom would cost" (growing cost bar)
  3. "Here's what changes with Appmixer" (costs shrinking animation)
  4. "Your bottom line" (final ROI reveal with celebration)
- Inspirace: pricing/ROI pages od Stripe, Vercel
- Mobile-first design, works great as a "deck" for stakeholders

**Nové soubory:** `StoryFlow.tsx`, refactor results page

---

### 10. "Share with CFO" Template
**Impact: Medium | Effort: Low**

URL sharing existuje, ale chybí kontextový share flow pro interní decision-making.

**Návrh:**
- "Send to your CFO" button → pre-filled email template:
  - Subject: "Integration Platform ROI Analysis — [Company] could save $X over 3 years"
  - Body: Key metrics, link to interactive results, PDF attachment option
- "Copy as Slack message" — formatted snippet
- LinkedIn share s preview card (OG meta tags)

**Soubory k úpravě:** `ActionButtons.tsx`, nový `ShareTemplates.tsx`

---

## Implementation Priority

| Priority | Feature | Impact | Effort | Sprint |
|----------|---------|--------|--------|--------|
| P0 | Lead capture (email report) | 🔴 Critical | Low | 1 |
| P1 | Use `currentIntegrationSpend` | High | Low | 1 |
| P1 | Self-hosted toggle logic | Medium | Low | 1 |
| P1 | Celebration animation | Medium | Low | 1 |
| P1 | CFO share template | Medium | Low | 1 |
| P2 | Quick mode (30s estimate) | High | Medium | 2 |
| P2 | Industry-specific benchmarks | High | Medium | 2 |
| P2 | Personalized results narrative | High | Medium | 2 |
| P3 | Competitor comparison | Medium | High | 3 |
| P3 | Story scroll flow | Medium | High | 3 |

---

## Notes

- Sprint 1 (P0 + P1) = quick wins, mostly UI + calculation fixes
- Sprint 2 (P2) = differentiation features, needs new data/content
- Sprint 3 (P3) = advanced, needs research + significant dev effort
- All changes client-side except lead capture (needs minimal backend or 3rd party service)
