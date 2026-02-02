"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { QuickCalculator } from "@/components/calculator/QuickCalculator";
import { fadeInUp } from "@/lib/animations";
import { Zap } from "lucide-react";

export default function QuickCalculatorPage() {
  return (
    <div className="min-h-screen bg-mesh-gradient">
      <header className="border-b bg-white/70 backdrop-blur-xl dark:bg-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <Image src="/logo.svg" alt="Appmixer" width={140} height={40} priority />
          </Link>
          <Link
            href="/calculator"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Full Calculator →
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          className="mb-10 text-center max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-300 mb-4">
            <Zap className="h-4 w-4" />
            30-Second Estimate
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Get Your{" "}
            <span className="text-gradient-primary">Integration ROI</span>{" "}
            Instantly
          </h1>
          <p className="text-muted-foreground text-lg">
            Just 3 inputs. Real-time results. Customize later if you want more detail.
          </p>
        </motion.div>

        <QuickCalculator />

        {/* Methodology note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Quick estimates use industry-typical values for your company size.{" "}
            <Link href="/calculator" className="text-primary hover:underline">
              Use the full calculator
            </Link>{" "}
            for precise inputs.
          </p>
          <p className="mt-1">
            <Link href="/methodology" className="text-primary hover:underline">
              View calculation methodology
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
