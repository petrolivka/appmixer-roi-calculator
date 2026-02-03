# PRD: SMB Competitor Comparison

**Version:** 1.0  
**Date:** 2026-02-03  
**Status:** Draft  
**Effort:** ~4-5 hours

---

## Problem Statement

Uživatelé ROI kalkulátoru často zvažují alternativy jako Zapier nebo Make. Bez kontextu "proč Appmixer místo X" mohou odejít s čísly, ale bez přesvědčení. Sales tým potřebuje konkrétní, obhajitelná data pro konverzace s prospects.

## Goal

Přidat sekci "Compare with Alternatives" která ukáže:
1. Cenové srovnání Appmixer vs Zapier/Make/n8n na základě user inputs
2. Feature gaps — co Appmixer má a SMB platformy ne
3. Kdy která platforma dává smysl (férový positioning)

## Non-Goals

- ❌ Enterprise iPaaS (MuleSoft, Workato, Tray.io) — "Contact Sales" pricing
- ❌ Embedded platforms (Paragon, Prismatic) — jiný use case
- ❌ Aggressive/FUD marketing — musí být fakticky přesné a férové

---

## Target Users

1. **Technical evaluators** — CTOs, architects porovnávající platformy
2. **Budget owners** — VP Eng, Finance schvalující spend
3. **Sales team** — interní použití pro deal support

---

## Competitors In Scope

| Platform | Why Include | Pricing Model |
|----------|-------------|---------------|
| **Zapier** | #1 name recognition, common "default choice" | Tasks/month |
| **Make** | Price-conscious alternative, popular in EU | Operations/month |
| **n8n** | Self-hosted option, developer favorite | Executions or self-host free |

---

## Verified Pricing Data (Feb 2026)

### Zapier
Source: https://zapier.com/pricing

| Plan | Monthly | Annual | Tasks/mo | Notes |
|------|---------|--------|----------|-------|
| Free | $0 | $0 | 100 | 2-step only |
| Professional | $19.99 | $240 | 750 | Multi-step |
| Professional | $49 | $588 | 2,000 | |
| Professional | $69 | $828 | 3,000 | |
| Professional | $99 | $1,188 | 5,000 | |
| Professional | $149 | $1,788 | 10,000 | |
| Professional | $249 | $2,988 | 20,000 | |
| Professional | $399 | $4,788 | 50,000 | |
| Professional | $599 | $7,188 | 100,000 | |
| Professional | $799 | $9,588 | 200,000 | |
| Professional | $999 | $11,988 | 500,000 | |
| Professional | $1,499 | $17,988 | 1,000,000 | |
| Professional | $1,999 | $23,988 | 1,500,000 | |
| Professional | $2,499 | $29,988 | 2,000,000 | |
| Team | $69 | $828 | 2,000 | 25 users, SSO |
| Enterprise | Custom | Custom | Custom | |

### Make (Integromat)
Source: https://make.com/en/pricing

| Plan | Monthly | Annual | Ops/mo | Notes |
|------|---------|--------|--------|-------|
| Free | $0 | $0 | 1,000 | |
| Core | $9 | $108 | 10,000 | |
| Pro | $16 | $192 | 10,000 | + custom functions, full-text search |
| Teams | $29 | $348 | 10,000 | + team features |
| Enterprise | Custom | Custom | Custom | |

*Note: Additional operations purchasable. Teams plan scales to higher volumes.*

### n8n
Source: https://n8n.io/pricing

| Plan | Monthly | Annual | Executions/mo | Notes |
|------|---------|--------|---------------|-------|
| Self-hosted | $0 | $0 | Unlimited | DIY infrastructure |
| Starter | $20 | $240 | 2,500 | Cloud hosted |
| Pro | $50 | $600 | 10,000 | + logging, sharing |
| Enterprise | Custom | Custom | Custom | |

---

## Feature Comparison Matrix

| Feature | Appmixer | Zapier | Make | n8n |
|---------|----------|--------|------|-----|
| **Self-hosted option** | ✅ | ❌ | ❌ | ✅ |
| **Embedded/White-label** | ✅ | ❌ | ❌ | ❌ |
| **Unlimited executions** | ✅ (self-host) | ❌ | ❌ | ✅ (self-host) |
| **No-code builder** | ✅ | ✅ | ✅ | ✅ |
| **API-first** | ✅ | ⚠️ | ⚠️ | ✅ |
| **Custom connectors** | ✅ | ✅ | ✅ | ✅ |
| **SSO/SAML** | ✅ | Team+ | Enterprise | Enterprise |
| **Audit logs** | ✅ | Team+ | Teams+ | Pro+ |
| **Branching/Conditions** | ✅ | ✅ | ✅ | ✅ |
| **Error handling** | ✅ | ✅ | ✅ | ✅ |
| **Connector count** | 200+ | 7,000+ | 1,500+ | 400+ |

### Key Differentiators for Appmixer

1. **Self-hosted deployment** — full data control, compliance, no vendor lock-in
2. **Embedded white-label** — integrate into your SaaS product
3. **Predictable pricing** — no per-task/operation surprises at scale
4. **API-first architecture** — everything programmable

### Where Competitors Win (Fairness)

1. **Zapier** — largest connector ecosystem (7,000+), best for non-technical users
2. **Make** — most affordable for low-volume, great visual builder
3. **n8n** — free self-hosted, strong developer community

---

## User Experience

### Entry Point
Results page → below Sensitivity Analysis → "Compare with Alternatives" section

### Default State
- Collapsed accordion OR visible summary table
- Shows top-line comparison based on user's inputs

### Interaction
1. User sees summary: "With your requirements, here's how Appmixer compares"
2. Can expand individual competitor cards for details
3. Can toggle competitors on/off
4. Comparison included in PDF export (optional checkbox)

---

## UI Specifications

### Summary View

```
┌─────────────────────────────────────────────────────────────────┐
│  💡 How does Appmixer compare to alternatives?                  │
│                                                                 │
│  Based on: 15 integrations, ~50K operations/month               │
│                                                                 │
│  ┌──────────┬─────────────┬─────────────────────────────────┐  │
│  │ Platform │ Est. Annual │ Key Difference                  │  │
│  ├──────────┼─────────────┼─────────────────────────────────┤  │
│  │ Appmixer │ $XXX        │ Your input                      │  │
│  │ Zapier   │ $4,788      │ No self-hosted/embedded         │  │
│  │ Make     │ $348        │ No self-hosted/embedded         │  │
│  │ n8n      │ $600        │ No embedded, smaller ecosystem  │  │
│  └──────────┴─────────────┴─────────────────────────────────┘  │
│                                                                 │
│  ✅ Appmixer advantage: Self-hosted • Embedded • No task limits │
│                                                                 │
│  [See detailed comparison ▼]                                    │
│                                                                 │
│  ℹ️ Pricing from public sources, Feb 2026. Your costs may vary. │
└─────────────────────────────────────────────────────────────────┘
```

### Expanded Detail Card

```
┌─────────────────────────────────────────────────────────────────┐
│  Zapier vs Appmixer                                    [Close]  │
│                                                                 │
│  YOUR VOLUME: ~50,000 ops/month ≈ 50,000 Zapier tasks          │
│                                                                 │
│  📊 COST COMPARISON                                             │
│  ├─ Zapier Professional (50K tasks): $399/mo → $4,788/year     │
│  └─ Your Appmixer cost: $XXX/year                               │
│                                                                 │
│  ✅ APPMIXER HAS                        ❌ ZAPIER LACKS         │
│  • Self-hosted deployment              • Self-hosted option     │
│  • Embedded white-label                • White-label embedding  │
│  • Predictable flat pricing            • Unlimited tasks        │
│                                                                 │
│  ⚠️ ZAPIER ADVANTAGE                                            │
│  • 7,000+ connectors (vs ~200)                                  │
│  • Household name / easier buy-in                               │
│                                                                 │
│  🎯 VERDICT                                                     │
│  Zapier is great for simple, low-volume workflows. For your    │
│  use case (embedded, self-hosted, or high volume), Appmixer    │
│  provides better value and flexibility.                         │
│                                                                 │
│  📎 zapier.com/pricing                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Calculation Logic

### Input Mapping

User provides `monthlyApiCalls` — we need to map to each platform's unit:

```typescript
interface VolumeMapping {
  appmixerCost: number;        // User-provided
  monthlyOperations: number;   // User's monthlyApiCalls
  
  // Derived (heuristics)
  zapierTasks: number;         // ~1:1 with operations for most workflows
  makeOperations: number;      // ~1.5-3x operations (Make counts each step)
  n8nExecutions: number;       // ~0.3-0.5x (n8n counts workflow runs, not steps)
}
```

### Mapping Heuristics

| Platform | Unit | Mapping from "operations" | Rationale |
|----------|------|---------------------------|-----------|
| Zapier | Task | 1:1 | Each action = 1 task |
| Make | Operation | 1.5x | Each module execution = 1 op |
| n8n | Execution | 0.3x | Counts workflow runs, not nodes |

### Tier Selection

```typescript
function getZapierAnnualCost(monthlyTasks: number): number {
  const tiers = [
    { tasks: 100, annual: 0 },
    { tasks: 750, annual: 240 },
    { tasks: 2000, annual: 588 },
    { tasks: 3000, annual: 828 },
    { tasks: 5000, annual: 1188 },
    { tasks: 10000, annual: 1788 },
    { tasks: 20000, annual: 2988 },
    { tasks: 50000, annual: 4788 },
    { tasks: 100000, annual: 7188 },
    { tasks: 200000, annual: 9588 },
    { tasks: 500000, annual: 11988 },
    { tasks: 1000000, annual: 17988 },
    { tasks: 1500000, annual: 23988 },
    { tasks: 2000000, annual: 29988 },
  ];
  
  const tier = tiers.find(t => t.tasks >= monthlyTasks);
  return tier ? tier.annual : 29988; // Max tier if over 2M
}
```

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Section engagement | >30% of users expand | Analytics event |
| PDF inclusion | >20% include comparison | PDF generation flag |
| Sales usefulness | Positive feedback | Qualitative survey |
| Pricing accuracy | 0 complaints | Support tickets |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pricing becomes outdated | Credibility loss | Monthly verification, "last updated" date |
| Unfair comparison perceived | Brand damage | Include competitor advantages, neutral tone |
| Mapping heuristics wrong | Misleading results | Add disclaimer, allow manual override |
| Legal issues with competitor names | Takedown request | Use "Based on published pricing", no logos without permission |

---

## Out of Scope (Future)

- Competitor logos (need permission or fair use review)
- Real-time pricing API (doesn't exist)
- User testimonials ("We switched from Zapier...")
- Feature-by-feature deep dive page

---

## Appendix: Disclaimer Text

```
Competitor pricing is based on publicly available information from official 
pricing pages as of February 2026. Actual costs may vary based on specific 
requirements, negotiated discounts, and plan changes. Task/operation mapping 
is estimated based on typical workflow patterns. Contact each vendor directly 
for accurate quotes. This comparison is provided for informational purposes 
and does not constitute an endorsement or criticism of any platform.
```
