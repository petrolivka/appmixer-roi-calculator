"use client";

import { CompetitorCostResult, formatCompetitorCost } from "@/lib/competitorPricing";
import type { Currency } from "@/types/calculator";

interface CompetitorSummaryTableProps {
  results: CompetitorCostResult[];
  appmixerAnnualCost: number;
  currency: Currency;
  onSelectCompetitor: (id: string) => void;
}

function ComparisonBadge({ result }: { result: CompetitorCostResult }) {
  const { cheaper, percentDiff } = result.vsAppmixer;

  if (cheaper === "similar") {
    return <span className="text-muted-foreground">~same</span>;
  }

  if (cheaper === "appmixer") {
    return <span className="text-red-600">+{Math.abs(percentDiff)}% more</span>;
  }

  return <span className="text-green-600">{Math.abs(percentDiff)}% less</span>;
}

export function CompetitorSummaryTable({
  results,
  appmixerAnnualCost,
  currency,
  onSelectCompetitor,
}: CompetitorSummaryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Platform</th>
            <th className="text-right py-2 font-medium">Est. Annual</th>
            <th className="text-right py-2 font-medium">vs Appmixer</th>
            <th className="text-left py-2 pl-4 font-medium hidden sm:table-cell">
              Key Difference
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Appmixer row */}
          <tr className="border-b bg-primary/5">
            <td className="py-3 font-medium">
              <span className="text-primary">●</span> Appmixer
            </td>
            <td className="text-right py-3 font-semibold">
              {formatCompetitorCost(appmixerAnnualCost, currency)}
            </td>
            <td className="text-right py-3 text-muted-foreground">—</td>
            <td className="py-3 pl-4 text-muted-foreground hidden sm:table-cell">
              Your configuration
            </td>
            <td></td>
          </tr>

          {/* Competitor rows */}
          {results.map((result) => (
            <tr
              key={result.competitor.id}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="py-3">{result.competitor.name}</td>
              <td className="text-right py-3">
                {formatCompetitorCost(result.annualCost, currency)}
              </td>
              <td className="text-right py-3">
                <ComparisonBadge result={result} />
              </td>
              <td className="py-3 pl-4 text-muted-foreground text-xs hidden sm:table-cell">
                {result.competitor.limitations[0]}
              </td>
              <td className="py-3 pl-2">
                <button
                  onClick={() => onSelectCompetitor(result.competitor.id)}
                  className="text-xs text-primary hover:underline whitespace-nowrap"
                >
                  Details →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
