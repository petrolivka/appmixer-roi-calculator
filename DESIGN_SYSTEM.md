# Appmixer Design System

A comprehensive design system built on **Tailwind CSS v3**, **shadcn/ui**, **Radix UI** primitives, and **Motion** (Framer Motion). Designed with HSL CSS custom properties for full light/dark mode support, glassmorphism effects, and gradient-rich visuals.

---

## Table of Contents

1. [Tech Stack & Dependencies](#tech-stack--dependencies)
2. [Configuration Files](#configuration-files)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing & Border Radius](#spacing--border-radius)
6. [Shadows & Effects](#shadows--effects)
7. [Animations & Motion](#animations--motion)
8. [Utility Classes](#utility-classes)
9. [Component Library](#component-library)
10. [Layout Patterns](#layout-patterns)
11. [Replication Guide](#replication-guide)

---

## Tech Stack & Dependencies

### Core Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^3.4.17 | Utility-first CSS framework |
| `@tailwindcss/forms` | ^0.5.9 | Form element reset/styling plugin |
| `autoprefixer` | ^10.4.23 | CSS vendor prefixing |
| `postcss` | ^8.4.49 | CSS processing pipeline |

### Component Architecture

| Package | Version | Purpose |
|---------|---------|---------|
| `class-variance-authority` | ^0.7.1 | Type-safe component variants (CVA) |
| `clsx` | ^2.1.1 | Conditional class name joining |
| `tailwind-merge` | ^2.6.0 | Intelligent Tailwind class deduplication |

### UI Primitives (Radix UI)

| Package | Version |
|---------|---------|
| `@radix-ui/react-label` | ^2.1.8 |
| `@radix-ui/react-progress` | ^1.1.8 |
| `@radix-ui/react-select` | ^2.2.6 |
| `@radix-ui/react-separator` | ^1.1.8 |
| `@radix-ui/react-slider` | ^1.3.6 |
| `@radix-ui/react-slot` | ^1.2.4 |
| `@radix-ui/react-switch` | ^1.2.6 |
| `@radix-ui/react-tabs` | ^1.1.13 |
| `@radix-ui/react-tooltip` | ^1.2.8 |

### Animation & Icons

| Package | Version | Purpose |
|---------|---------|---------|
| `motion` | ^12.29.2 | Animation library (Motion/Framer Motion) |
| `lucide-react` | ^0.469.0 | Icon library |

### Framework

| Package | Version |
|---------|---------|
| `next` | 16.1.5 |
| `react` | 19.2.4 |
| `typescript` | ^5.7.2 |

---

## Configuration Files

### PostCSS (`postcss.config.mjs`)

```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

### shadcn/ui (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Tailwind (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "accent-purple": "hsl(var(--accent-purple))",
        "accent-blue": "hsl(var(--accent-blue))",
        "accent-emerald": "hsl(var(--accent-emerald))",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
```

---

## Color System

All colors use **HSL format** via CSS custom properties, enabling opacity modifiers (`bg-primary/50`) and easy theming.

### Semantic Color Tokens

| Token | Light Mode HSL | Light Hex | Dark Mode HSL | Purpose |
|-------|---------------|-----------|---------------|---------|
| `--primary` | `351 91% 52%` | `#F3153C` | `351 91% 58%` | Brand red (Appmixer) |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | `0 0% 100%` | Text on primary |
| `--background` | `0 0% 100%` | `#FFFFFF` | `222 25% 6%` | Page background |
| `--foreground` | `220 20% 10%` | `~#141A2A` | `0 0% 98%` | Primary text |
| `--card` | `0 0% 100%` | `#FFFFFF` | `222 25% 8%` | Card surfaces |
| `--card-foreground` | `220 20% 10%` | `~#141A2A` | `0 0% 98%` | Card text |
| `--popover` | `0 0% 100%` | `#FFFFFF` | `222 25% 8%` | Popover/dropdown bg |
| `--popover-foreground` | `220 20% 10%` | `~#141A2A` | `0 0% 98%` | Popover text |
| `--secondary` | `220 14% 96%` | `~#F3F4F6` | `222 20% 14%` | Secondary surfaces |
| `--secondary-foreground` | `220 20% 10%` | `~#141A2A` | `0 0% 98%` | Secondary text |
| `--muted` | `220 14% 96%` | `~#F3F4F6` | `222 20% 14%` | Muted backgrounds |
| `--muted-foreground` | `220 10% 46%` | `~#6B7280` | `220 10% 65%` | Subdued text |
| `--accent` | `220 14% 96%` | `~#F3F4F6` | `222 20% 14%` | Interactive highlights |
| `--accent-foreground` | `220 20% 10%` | `~#141A2A` | `0 0% 98%` | Accent text |
| `--destructive` | `0 84% 60%` | `~#EF4444` | `0 70% 45%` | Error/danger |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | `0 0% 98%` | Text on destructive |
| `--border` | `220 13% 91%` | `~#E4E7EB` | `222 20% 16%` | Borders |
| `--input` | `220 13% 91%` | `~#E4E7EB` | `222 20% 16%` | Input borders |
| `--ring` | `351 91% 52%` | `#F3153C` | `351 91% 58%` | Focus rings |
| `--radius` | `0.75rem` (12px) | — | same | Base border radius |

### Chart Colors

| Token | Light Mode HSL | Dark Mode HSL | Visual |
|-------|---------------|---------------|--------|
| `--chart-1` | `351 91% 52%` | `351 85% 60%` | Primary Red |
| `--chart-2` | `160 60% 40%` | `160 55% 45%` | Emerald/Teal |
| `--chart-3` | `220 70% 50%` | `220 65% 55%` | Blue |
| `--chart-4` | `280 65% 55%` | `280 60% 60%` | Purple |
| `--chart-5` | `35 90% 50%` | `35 85% 55%` | Orange/Gold |

### Extended Accent Palette

| Token | Light Mode HSL | Dark Mode HSL |
|-------|---------------|---------------|
| `--accent-purple` | `280 65% 55%` | `280 60% 60%` |
| `--accent-blue` | `220 70% 50%` | `220 65% 55%` |
| `--accent-emerald` | `160 60% 40%` | `160 55% 45%` |

### CSS Variables Block (copy into `globals.css`)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 220 20% 10%;
    --card: 0 0% 100%;
    --card-foreground: 220 20% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 20% 10%;
    --primary: 351 91% 52%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 14% 96%;
    --secondary-foreground: 220 20% 10%;
    --muted: 220 14% 96%;
    --muted-foreground: 220 10% 46%;
    --accent: 220 14% 96%;
    --accent-foreground: 220 20% 10%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 351 91% 52%;
    --radius: 0.75rem;
    --chart-1: 351 91% 52%;
    --chart-2: 160 60% 40%;
    --chart-3: 220 70% 50%;
    --chart-4: 280 65% 55%;
    --chart-5: 35 90% 50%;
    --accent-purple: 280 65% 55%;
    --accent-blue: 220 70% 50%;
    --accent-emerald: 160 60% 40%;
  }

  .dark {
    --background: 222 25% 6%;
    --foreground: 0 0% 98%;
    --card: 222 25% 8%;
    --card-foreground: 0 0% 98%;
    --popover: 222 25% 8%;
    --popover-foreground: 0 0% 98%;
    --primary: 351 91% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 222 20% 14%;
    --secondary-foreground: 0 0% 98%;
    --muted: 222 20% 14%;
    --muted-foreground: 220 10% 65%;
    --accent: 222 20% 14%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 70% 45%;
    --destructive-foreground: 0 0% 98%;
    --border: 222 20% 16%;
    --input: 222 20% 16%;
    --ring: 351 91% 58%;
    --chart-1: 351 85% 60%;
    --chart-2: 160 55% 45%;
    --chart-3: 220 65% 55%;
    --chart-4: 280 60% 60%;
    --chart-5: 35 85% 55%;
    --accent-purple: 280 60% 60%;
    --accent-blue: 220 65% 55%;
    --accent-emerald: 160 55% 45%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## Typography

### Font Families

| Role | Font | Weights | CSS Variable | Tailwind Class |
|------|------|---------|-------------|----------------|
| Body / Sans | **Inter** | Variable (all) | `--font-inter` | `font-sans` |
| Headings | **Montserrat** | 400, 500, 600, 700, 800 | `--font-montserrat` | `font-heading` |

### Font Loading (Next.js)

```typescript
import { Inter, Montserrat } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

// Apply to <html> element:
// className={`${inter.variable} ${montserrat.variable}`}
```

### Tailwind Config

```typescript
fontFamily: {
  sans: ["var(--font-inter)", "system-ui", "sans-serif"],
  heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
},
```

### Typography Scale

Uses Tailwind's default scale. Common patterns in the codebase:

| Element | Classes |
|---------|---------|
| Page title | `font-heading text-4xl font-bold` |
| Section heading | `font-heading text-2xl font-semibold` |
| Card title | `font-heading text-lg font-semibold` |
| Body text | `text-base` (Inter, inherited) |
| Small/caption | `text-sm text-muted-foreground` |
| Label | `text-sm font-medium` |

---

## Spacing & Border Radius

### Border Radius Scale

Based on `--radius: 0.75rem` (12px):

| Class | Value | Pixels |
|-------|-------|--------|
| `rounded-xl` | `calc(var(--radius) + 4px)` | ~16px |
| `rounded-lg` | `var(--radius)` | 12px |
| `rounded-md` | `calc(var(--radius) - 2px)` | 10px |
| `rounded-sm` | `calc(var(--radius) - 4px)` | 8px |
| `rounded-full` | `9999px` | Full circle |

### Responsive Breakpoints

Default Tailwind breakpoints (no custom overrides):

| Breakpoint | Min Width |
|-----------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## Shadows & Effects

### Shadow Patterns

| Pattern | Classes | Usage |
|---------|---------|-------|
| Card shadow | `shadow-md` | Default cards |
| Glass shadow | `shadow-lg` | Glass-effect cards |
| Button shadow | `shadow-lg shadow-primary/25` | Primary buttons |
| Button hover | `shadow-xl shadow-primary/30` | Primary button hover |
| Slider thumb | `shadow-lg shadow-primary/30` | Range slider thumb |

### Glassmorphism

```css
/* Light mode */
.glass {
  @apply bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg;
}

/* Dark mode */
.dark .glass {
  @apply bg-white/5 border-white/10;
}
```

Equivalent Tailwind (inline):
```
bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg
dark:bg-white/5 dark:border-white/10
```

### Text Gradients

```css
.text-gradient-primary {
  @apply bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent;
}

.text-gradient-emerald {
  @apply bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent;
}
```

### Mesh Background Gradient

A multi-layered radial gradient used for page backgrounds:

```css
.bg-mesh-gradient {
  background:
    radial-gradient(ellipse 80% 60% at 10% 20%, hsl(351 91% 52% / 0.06), transparent),
    radial-gradient(ellipse 60% 80% at 80% 80%, hsl(280 65% 55% / 0.06), transparent),
    radial-gradient(ellipse 70% 50% at 50% 50%, hsl(220 70% 50% / 0.04), transparent),
    hsl(var(--background));
}

.dark .bg-mesh-gradient {
  background:
    radial-gradient(ellipse 80% 60% at 10% 20%, hsl(351 91% 52% / 0.1), transparent),
    radial-gradient(ellipse 60% 80% at 80% 80%, hsl(280 65% 55% / 0.08), transparent),
    radial-gradient(ellipse 70% 50% at 50% 50%, hsl(220 70% 50% / 0.06), transparent),
    hsl(var(--background));
}
```

---

## Animations & Motion

### CSS Keyframe Animations (Tailwind)

Use via `animate-*` classes:

| Class | Keyframe | Duration | Easing |
|-------|----------|----------|--------|
| `animate-fade-in-up` | translateY(20px) -> 0 + opacity | 0.5s | ease-out |
| `animate-fade-in` | opacity 0 -> 1 | 0.4s | ease-out |
| `animate-scale-in` | scale(0.95) -> 1 + opacity | 0.3s | ease-out |
| `animate-slide-in-right` | translateX(20px) -> 0 + opacity | 0.4s | ease-out |
| `animate-slide-in-left` | translateX(-20px) -> 0 + opacity | 0.4s | ease-out |

### Motion.js (Framer Motion) Variants

Place in `src/lib/animations.ts`:

```typescript
import type { Variants } from "motion/react";

// Fade in from below
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Simple fade
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Stagger parent container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger child items
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Hover/tap micro-interaction
export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

// Slide in from right (with exit)
export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Slide in from left (with exit)
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Chart/data visualization reveal
export const chartReveal: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
```

### Usage Pattern

```tsx
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.div variants={staggerItem}>Item 1</motion.div>
  <motion.div variants={staggerItem}>Item 2</motion.div>
</motion.div>
```

---

## Utility Classes

### `cn()` — Class Name Merger

Place in `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This utility intelligently merges Tailwind classes, resolving conflicts (e.g., `cn("px-4", "px-6")` yields `"px-6"`).

### Custom Utility Classes Summary

| Class | Effect |
|-------|--------|
| `glass` | Glassmorphism (frosted glass) effect |
| `text-gradient-primary` | Red-to-rose gradient text |
| `text-gradient-emerald` | Emerald-to-teal gradient text |
| `bg-mesh-gradient` | Multi-layer radial gradient page background |
| `font-heading` | Montserrat headings |
| `font-sans` | Inter body text |

---

## Component Library

All components follow the **shadcn/ui** pattern: Radix UI primitives styled with Tailwind, using CVA for variants and `cn()` for class merging.

### Button

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `gradient`
**Sizes:** `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (h-10 w-10)

```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary to-rose-500 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Card

**Variants:** `default`, `glass`

```typescript
const cardVariants = cva(
  "rounded-xl text-card-foreground shadow-md transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border bg-card",
        glass:
          "bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg dark:bg-white/5 dark:border-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Input

```
flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2
text-base ring-offset-background transition-all duration-200
file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground
placeholder:text-muted-foreground
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50
disabled:cursor-not-allowed disabled:opacity-50
md:text-sm
```

### Slider

- **Track:** `h-2 rounded-full bg-secondary`
- **Range (filled):** `bg-gradient-to-r from-primary to-rose-400`
- **Thumb:** `h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg shadow-primary/30 hover:scale-110`

### Switch

- **Root:** `h-6 w-11 rounded-full` with `data-[state=checked]:bg-primary data-[state=unchecked]:bg-input`
- **Thumb:** `h-5 w-5 rounded-full bg-background shadow-lg` with `data-[state=checked]:translate-x-5`

### Tooltip

Glassmorphism tooltip:
```
rounded-lg bg-white/80 backdrop-blur-lg border border-white/20
shadow-lg dark:bg-gray-900/80 dark:border-white/10
```

### Separator

Gradient separator (fades from transparent at edges):
```
/* Horizontal */
h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent

/* Vertical */
h-full w-[1px] bg-gradient-to-b from-transparent via-border to-transparent
```

### Progress

- **Track:** `h-4 rounded-full bg-secondary`
- **Indicator:** `bg-primary` with translateX transform

### Tabs

- **TabsList:** `rounded-md bg-muted p-1`
- **TabsTrigger:** `rounded-sm px-3 py-1.5 text-sm font-medium` with `data-[state=active]:bg-background data-[state=active]:shadow-sm`

### Table

- **Header row:** Bottom border `[&_tr]:border-b`
- **Body rows:** `border-b hover:bg-muted/50 data-[state=selected]:bg-muted`
- **Head cells:** `h-12 px-4 font-medium text-muted-foreground`
- **Body cells:** `p-4`
- **Footer:** `border-t bg-muted/50 font-medium`

### Select

- **Trigger:** `h-10 rounded-md border border-input bg-background`
- **Content:** `rounded-md border bg-popover shadow-md` with entrance animations
- **Item:** `rounded-sm py-1.5 pl-8 pr-2` with `focus:bg-accent focus:text-accent-foreground`

---

## Layout Patterns

### Dark Mode Strategy

- **Method:** Class-based (`darkMode: ["class"]`)
- Toggle the `dark` class on `<html>` element
- All semantic colors switch automatically via CSS variables

### Common Layout Classes

```tsx
// Full-page background
<div className="min-h-screen bg-mesh-gradient">

// Centered container
<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// Glass card
<div className="glass rounded-xl p-6">

// Section with stagger animation
<motion.section variants={staggerContainer} initial="hidden" animate="visible">
```

### Focus States

All interactive elements use consistent focus styling:
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Transition Duration

Standard: `transition-all duration-200` (200ms for interactive state changes)

---

## Replication Guide

To replicate this design system in a new Next.js project:

### 1. Install Dependencies

```bash
# Core
npm install tailwindcss@^3.4 postcss autoprefixer @tailwindcss/forms

# Class utilities
npm install class-variance-authority clsx tailwind-merge

# Radix UI primitives (install as needed)
npm install @radix-ui/react-label @radix-ui/react-progress @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip

# Animation & icons
npm install motion lucide-react
```

### 2. Copy Configuration Files

1. **`tailwind.config.ts`** — Full config from [Tailwind section](#tailwind-tailwindconfigts)
2. **`postcss.config.mjs`** — PostCSS config from [PostCSS section](#postcss-postcssconfigmjs)
3. **`components.json`** — shadcn/ui config from [shadcn section](#shadcnui-componentsjson)

### 3. Set Up Global Styles

Copy the full CSS variables block into `src/app/globals.css` including:
- `:root` and `.dark` variable blocks
- Base layer reset (`border-border`, `bg-background text-foreground`)
- Utility classes (`glass`, `text-gradient-primary`, `text-gradient-emerald`, `bg-mesh-gradient`)

### 4. Set Up Fonts

In `src/app/layout.tsx`:
```tsx
import { Inter, Montserrat } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

### 5. Create Utility Files

- **`src/lib/utils.ts`** — The `cn()` function
- **`src/lib/animations.ts`** — Motion variants

### 6. Copy UI Components

Copy components from `src/components/ui/` as needed. Each component is self-contained and only depends on:
- `@/lib/utils` (the `cn` function)
- Its respective Radix UI primitive
- `class-variance-authority` (for Button and Card)
- `lucide-react` (for Select icons)

### Key Design Principles

1. **HSL CSS Variables** — All colors defined as space-separated HSL values for opacity support
2. **Semantic tokens** — Use `primary`, `secondary`, `muted`, etc. instead of raw colors
3. **Glass-first cards** — Prefer `glass` variant for elevated surfaces
4. **Gradient accents** — Primary-to-rose gradients for buttons, sliders, text highlights
5. **Subtle mesh backgrounds** — Multi-layer radial gradients at very low opacity
6. **Consistent transitions** — 200ms `transition-all` on all interactive elements
7. **Spring micro-interactions** — Motion.js `scaleOnHover` for tactile feel
8. **Gradient separators** — Separators fade from transparent at edges
9. **Generous border radius** — 12px base radius for a soft, modern look
10. **Primary shadow glow** — Buttons cast colored shadows using `shadow-primary/25`
