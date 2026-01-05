import type { Currency } from "@/types/calculator";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

export const CURRENCY_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

export function formatCurrency(
  amount: number,
  currency: Currency,
  options?: { compact?: boolean; decimals?: number }
): string {
  const { compact = false, decimals = 0 } = options || {};
  const symbol = CURRENCY_SYMBOLS[currency];

  if (compact && Math.abs(amount) >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (compact && Math.abs(amount) >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }

  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) return amount;

  // Convert to USD first, then to target currency
  const usdAmount = amount / CURRENCY_EXCHANGE_RATES[fromCurrency];
  return usdAmount * CURRENCY_EXCHANGE_RATES[toCurrency];
}
