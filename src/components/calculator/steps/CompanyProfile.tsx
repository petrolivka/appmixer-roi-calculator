"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CompanyProfileInputs, CompanySize, IndustryVertical, IntegrationApproach, Currency } from "@/types/calculator";
import { formatCurrency, CURRENCY_SYMBOLS } from "@/lib/currency";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompanyProfileProps {
  data: CompanyProfileInputs;
  currency: Currency;
  onUpdate: (updates: Partial<CompanyProfileInputs>) => void;
  onCurrencyChange: (currency: Currency) => void;
}

const companySizeOptions: { value: CompanySize; label: string }[] = [
  { value: "smb", label: "SMB (1-100 employees)" },
  { value: "mid-market", label: "Mid-Market (101-1000 employees)" },
  { value: "enterprise", label: "Enterprise (1000+ employees)" },
];

const industryOptions: { value: IndustryVertical; label: string }[] = [
  { value: "saas", label: "SaaS / Software" },
  { value: "fintech", label: "FinTech / Financial Services" },
  { value: "healthtech", label: "HealthTech / Healthcare" },
  { value: "ecommerce", label: "E-commerce / Retail" },
  { value: "logistics", label: "Logistics / Supply Chain" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
];

const integrationApproachOptions: { value: IntegrationApproach; label: string; description: string }[] = [
  { value: "custom-code", label: "Custom Code", description: "Building integrations in-house" },
  { value: "other-ipaas", label: "Other iPaaS", description: "Using another integration platform" },
  { value: "none", label: "None / Starting Fresh", description: "No current integration solution" },
];

const currencyOptions: Currency[] = ["USD", "EUR", "GBP"];

export function CompanyProfile({ data, currency, onUpdate, onCurrencyChange }: CompanyProfileProps) {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Company Profile</h2>
          <p className="text-muted-foreground">
            Tell us about your organization to personalize your ROI calculation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(v) => onCurrencyChange(v as Currency)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {CURRENCY_SYMBOLS[curr]} {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company Size */}
          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select
              value={data.companySize}
              onValueChange={(v) => onUpdate({ companySize: v as CompanySize })}
            >
              <SelectTrigger id="companySize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companySizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry Vertical */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={data.industryVertical}
              onValueChange={(v) => onUpdate({ industryVertical: v as IndustryVertical })}
            >
              <SelectTrigger id="industry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Number of Developers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="developers">Number of Developers</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total developers who might work on integrations</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="developers"
              type="number"
              min={1}
              max={1000}
              value={data.numberOfDevelopers}
              onChange={(e) =>
                onUpdate({ numberOfDevelopers: parseInt(e.target.value) || 1 })
              }
            />
          </div>

          {/* Developer Hourly Cost */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="hourlyRate">Avg. Developer Hourly Cost</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fully-loaded cost including salary, benefits, overhead</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {CURRENCY_SYMBOLS[currency]}
              </span>
              <Input
                id="hourlyRate"
                type="number"
                min={20}
                max={500}
                className="pl-8"
                value={data.developerHourlyCost}
                onChange={(e) =>
                  onUpdate({ developerHourlyCost: parseInt(e.target.value) || 80 })
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                /hour
              </span>
            </div>
          </div>

          {/* Current Integration Approach */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Current Integration Approach</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {integrationApproachOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdate({ currentIntegrationApproach: option.value })}
                  className={`flex flex-col items-start p-4 rounded-lg border-2 transition-colors text-left ${
                    data.currentIntegrationApproach === option.value
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
