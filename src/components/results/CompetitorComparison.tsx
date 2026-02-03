"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CompetitorSummaryTable } from "./CompetitorSummaryTable";
import { CompetitorDetailCard } from "./CompetitorDetailCard";
import { calculateAllCompetitors } from "@/lib/competitorPricing";
import { appmixerAdvantages } from "@/data/competitors";
import type { Currency } from "@/types/calculator";

interface CompetitorComparisonProps {
  monthlyOperations: number;
  appmixerAnnualCost: number;
  currency?: Currency;
}

export function CompetitorComparison({
  monthlyOperations,
  appmixerAnnualCost,
  currency = "USD",
}: CompetitorComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const results = calculateAllCompetitors(monthlyOperations, appmixerAnnualCost);
  const selectedResult = results.find((r) => r.competitor.id === selectedCompetitor);

  return (
    <section className="mt-8 rounded-lg border bg-card p-6">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left group"
      >
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            💡 How does Appmixer compare to alternatives?
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Based on ~{monthlyOperations.toLocaleString()} operations/month
          </p>
        </div>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-6">
              {/* Summary Table */}
              <CompetitorSummaryTable
                results={results}
                appmixerAnnualCost={appmixerAnnualCost}
                currency={currency}
                onSelectCompetitor={setSelectedCompetitor}
              />

              {/* Appmixer Advantages */}
              <div className="rounded-md bg-primary/5 p-4 border border-primary/10">
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
              <AnimatePresence>
                {selectedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CompetitorDetailCard
                      result={selectedResult}
                      appmixerAnnualCost={appmixerAnnualCost}
                      monthlyOperations={monthlyOperations}
                      currency={currency}
                      onClose={() => setSelectedCompetitor(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  Pricing from public sources as of Feb 2026. Task/operation mapping
                  is estimated based on typical workflow patterns. Contact each vendor
                  for accurate quotes.
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
