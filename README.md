# Appmixer ROI Calculator

An interactive web application that helps organizations calculate their return on investment when adopting [Appmixer](https://appmixer.com) over building custom integrations in-house. Provides personalized financial projections, break-even analysis, and detailed cost comparisons over a 3-year period.

## Features

- **Multi-step calculator wizard** -- Company profile, integration requirements, and current cost inputs with real-time preview
- **ROI dashboard** -- Total ROI %, payback period, 3-year savings, break-even month, and NPV
- **Interactive charts** -- Cost comparison bar chart, break-even timeline, and benefit breakdown (Recharts)
- **Sensitivity analysis** -- Adjust developer cost, integration count, and complexity with live recalculation
- **PDF report export** -- Download a branded report for stakeholder presentations
- **Shareable results** -- URL-encoded state for sharing calculations
- **Calculation methodology page** -- Transparent documentation of all formulas and industry benchmarks
- **Multi-currency support** -- USD, EUR, GBP

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 3 with custom design tokens
- **UI primitives:** Radix UI (accessible, unstyled components)
- **Charts:** Recharts
- **Animations:** Motion (Framer Motion)
- **PDF generation:** @react-pdf/renderer
- **Validation:** Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone <repository-url>
cd appmixer-roi-calculator
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                            # Next.js App Router pages
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── globals.css                 # Global styles and CSS variables
│   ├── calculator/
│   │   ├── page.tsx                # Calculator wizard
│   │   └── results/page.tsx        # Results dashboard
│   └── methodology/page.tsx        # Calculation methodology docs
│
├── components/
│   ├── calculator/                 # Wizard, progress, preview, step forms
│   ├── results/                    # Charts, metrics, tables, action buttons
│   └── ui/                         # Radix-based design system components
│
├── lib/
│   ├── calculations/               # ROI engine (build costs, Appmixer costs,
│   │                               #   benefits, ROI metrics, projections)
│   ├── constants/                  # Industry benchmarks and pricing tiers
│   ├── pdf/generateReport.tsx      # PDF report generation
│   ├── animations.ts              # Shared Motion animation variants
│   ├── currency.ts                # Currency formatting and exchange rates
│   └── utils.ts                   # General utilities
│
├── types/                          # TypeScript type definitions
└── hooks/                          # Custom React hooks
```

## Environment Variables

No environment variables are required. All calculations run client-side with no external API dependencies.

## Industry Benchmarks

Calculations are based on published research from:

- **Nucleus Research** -- iPaaS ROI studies
- **Informatica** -- Integration cost benchmarks
- **Gartner** -- Enterprise integration market analysis
- **Fortune Business Insights** -- iPaaS market projections
