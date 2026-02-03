"use client";

import { X, ExternalLink, Check, AlertCircle } from "lucide-react";
import { CompetitorCostResult, formatCompetitorCost } from "@/lib/competitorPricing";
import type { Currency } from "@/types/calculator";

interface CompetitorDetailCardProps {
  result: CompetitorCostResult;
  appmixerAnnualCost: number;
  monthlyOperations: number;
  currency: Currency;
  onClose: () => void;
}

export function CompetitorDetailCard({
  result,
  appmixerAnnualCost,
  monthlyOperations,
  currency,
  onClose,
}: CompetitorDetailCardProps) {
  const { competitor, monthlyUnits, annualCost, vsAppmixer } = result;

  return (
    <div className="rounded-lg border bg-muted/30 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-semibold text-lg">
          {competitor.name} vs Appmixer
        </h4>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Volume mapping */}
      <p className="text-sm text-muted-foreground mb-4">
        Your volume: ~{monthlyOperations.toLocaleString()} ops/month ≈{" "}
        {monthlyUnits.toLocaleString()} {competitor.unitName}s/month
      </p>

      {/* Cost comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-md bg-background p-3 border">
          <p className="text-xs text-muted-foreground">{competitor.name}</p>
          <p className="text-xl font-bold">
            {formatCompetitorCost(annualCost, currency)}/yr
          </p>
          <p className="text-xs text-muted-foreground">
            {formatCompetitorCost(result.monthlyCost, currency)}/mo
          </p>
        </div>
        <div className="rounded-md bg-primary/10 p-3 border border-primary/20">
          <p className="text-xs text-muted-foreground">Appmixer</p>
          <p className="text-xl font-bold text-primary">
            {formatCompetitorCost(appmixerAnnualCost, currency)}/yr
          </p>
          <p className="text-xs text-muted-foreground">Your configured cost</p>
        </div>
      </div>

      {/* Feature comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Appmixer has */}
        <div>
          <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
            <Check className="h-4 w-4" /> Appmixer has
          </p>
          <ul className="text-sm space-y-1">
            {competitor.limitations.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                • {item.replace(/^No /, "")}
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor advantage */}
        <div>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> {competitor.name} advantage
          </p>
          <ul className="text-sm space-y-1">
            {competitor.advantages.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verdict */}
      <div className="rounded-md bg-background p-4 mb-4 border">
        <p className="text-sm font-medium mb-1">🎯 Verdict</p>
        <p className="text-sm text-muted-foreground">
          {competitor.name} is best for: {competitor.bestFor}.
          {vsAppmixer.cheaper === "appmixer" && (
            <> For your requirements, Appmixer provides better value.</>
          )}
          {vsAppmixer.cheaper === "competitor" && (
            <>
              {" "}
              {competitor.name} is more affordable, but lacks self-hosted/embedded
              options.
            </>
          )}
          {vsAppmixer.cheaper === "similar" && (
            <> Pricing is similar — choose based on feature needs.</>
          )}
        </p>
      </div>

      {/* Source */}
      <a
        href={competitor.pricingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
      >
        <ExternalLink className="h-3 w-3" />
        {competitor.pricingUrl}
      </a>
    </div>
  );
}
