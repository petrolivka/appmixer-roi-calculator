import { describe, it, expect } from 'vitest'
import { formatCurrency, convertCurrency, CURRENCY_SYMBOLS, CURRENCY_EXCHANGE_RATES } from './currency'

describe('formatCurrency', () => {
  describe('basic formatting', () => {
    it('should format USD with default options', () => {
      expect(formatCurrency(1234, 'USD')).toBe('$1,234')
    })

    it('should format EUR with default options', () => {
      expect(formatCurrency(1234, 'EUR')).toBe('€1,234')
    })

    it('should format GBP with default options', () => {
      expect(formatCurrency(1234, 'GBP')).toBe('£1,234')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0')
    })

    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234, 'USD')).toBe('$-1,234')
    })
  })

  describe('decimal formatting', () => {
    it('should format with 0 decimals (default)', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,235')
    })

    it('should format with 2 decimals', () => {
      expect(formatCurrency(1234.56, 'USD', { decimals: 2 })).toBe('$1,234.56')
    })

    it('should format with 1 decimal', () => {
      expect(formatCurrency(1234.56, 'USD', { decimals: 1 })).toBe('$1,234.6')
    })

    it('should pad zeros for decimal places', () => {
      expect(formatCurrency(1234, 'USD', { decimals: 2 })).toBe('$1,234.00')
    })
  })

  describe('compact formatting', () => {
    it('should format thousands with K suffix', () => {
      expect(formatCurrency(1500, 'USD', { compact: true })).toBe('$2K')
    })

    it('should format exact thousands with K suffix', () => {
      expect(formatCurrency(5000, 'USD', { compact: true })).toBe('$5K')
    })

    it('should format hundreds of thousands with K suffix', () => {
      expect(formatCurrency(350000, 'USD', { compact: true })).toBe('$350K')
    })

    it('should format millions with M suffix', () => {
      expect(formatCurrency(1500000, 'USD', { compact: true })).toBe('$1.5M')
    })

    it('should format exact millions with M suffix', () => {
      expect(formatCurrency(5000000, 'USD', { compact: true })).toBe('$5.0M')
    })

    it('should format tens of millions with M suffix', () => {
      expect(formatCurrency(25000000, 'USD', { compact: true })).toBe('$25.0M')
    })

    it('should not compact numbers under 1000', () => {
      expect(formatCurrency(999, 'USD', { compact: true })).toBe('$999')
    })

    it('should handle negative thousands with compact', () => {
      expect(formatCurrency(-5000, 'USD', { compact: true })).toBe('$-5K')
    })

    it('should handle negative millions with compact', () => {
      expect(formatCurrency(-2500000, 'USD', { compact: true })).toBe('$-2.5M')
    })
  })

  describe('all currencies', () => {
    it('should format all supported currencies correctly', () => {
      const currencies: Array<'USD' | 'EUR' | 'GBP'> = ['USD', 'EUR', 'GBP']
      const symbols = ['$', '€', '£']

      currencies.forEach((currency, index) => {
        const result = formatCurrency(1000, currency)
        expect(result).toContain(symbols[index])
        expect(result).toContain('1,000')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999, 'USD', { compact: true })).toBe('$1000.0M')
    })

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01, 'USD', { decimals: 2 })).toBe('$0.01')
    })

    it('should handle fractional thousands in compact mode', () => {
      expect(formatCurrency(1234, 'USD', { compact: true })).toBe('$1K')
    })
  })
})

describe('convertCurrency', () => {
  describe('same currency conversions', () => {
    it('should return same amount for USD to USD', () => {
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100)
    })

    it('should return same amount for EUR to EUR', () => {
      expect(convertCurrency(100, 'EUR', 'EUR')).toBe(100)
    })

    it('should return same amount for GBP to GBP', () => {
      expect(convertCurrency(100, 'GBP', 'GBP')).toBe(100)
    })
  })

  describe('USD conversions', () => {
    it('should convert USD to EUR', () => {
      const result = convertCurrency(100, 'USD', 'EUR')
      expect(result).toBeCloseTo(92, 1) // 100 * 0.92
    })

    it('should convert USD to GBP', () => {
      const result = convertCurrency(100, 'USD', 'GBP')
      expect(result).toBeCloseTo(79, 1) // 100 * 0.79
    })
  })

  describe('EUR conversions', () => {
    it('should convert EUR to USD', () => {
      const result = convertCurrency(92, 'EUR', 'USD')
      expect(result).toBeCloseTo(100, 1) // 92 / 0.92
    })

    it('should convert EUR to GBP', () => {
      const result = convertCurrency(92, 'EUR', 'GBP')
      // 92 / 0.92 = 100 USD, 100 * 0.79 = 79 GBP
      expect(result).toBeCloseTo(79, 1)
    })
  })

  describe('GBP conversions', () => {
    it('should convert GBP to USD', () => {
      const result = convertCurrency(79, 'GBP', 'USD')
      expect(result).toBeCloseTo(100, 1) // 79 / 0.79
    })

    it('should convert GBP to EUR', () => {
      const result = convertCurrency(79, 'GBP', 'EUR')
      // 79 / 0.79 = 100 USD, 100 * 0.92 = 92 EUR
      expect(result).toBeCloseTo(92, 1)
    })
  })

  describe('round-trip conversions', () => {
    it('should maintain approximate value in round-trip USD->EUR->USD', () => {
      const original = 100
      const toEur = convertCurrency(original, 'USD', 'EUR')
      const backToUsd = convertCurrency(toEur, 'EUR', 'USD')
      expect(backToUsd).toBeCloseTo(original, 1)
    })

    it('should maintain approximate value in round-trip USD->GBP->USD', () => {
      const original = 100
      const toGbp = convertCurrency(original, 'USD', 'GBP')
      const backToUsd = convertCurrency(toGbp, 'GBP', 'USD')
      expect(backToUsd).toBeCloseTo(original, 1)
    })

    it('should maintain approximate value in round-trip EUR->GBP->EUR', () => {
      const original = 100
      const toGbp = convertCurrency(original, 'EUR', 'GBP')
      const backToEur = convertCurrency(toGbp, 'GBP', 'EUR')
      expect(backToEur).toBeCloseTo(original, 1)
    })
  })

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(convertCurrency(0, 'USD', 'EUR')).toBe(0)
    })

    it('should handle negative amounts', () => {
      const result = convertCurrency(-100, 'USD', 'EUR')
      expect(result).toBeCloseTo(-92, 1)
    })

    it('should handle large amounts', () => {
      const result = convertCurrency(1000000, 'USD', 'EUR')
      expect(result).toBeCloseTo(920000, -2)
    })

    it('should handle small fractional amounts', () => {
      const result = convertCurrency(0.01, 'USD', 'EUR')
      expect(result).toBeCloseTo(0.0092, 4)
    })
  })
})

describe('Currency constants', () => {
  describe('CURRENCY_SYMBOLS', () => {
    it('should have all currency symbols defined', () => {
      expect(CURRENCY_SYMBOLS.USD).toBe('$')
      expect(CURRENCY_SYMBOLS.EUR).toBe('€')
      expect(CURRENCY_SYMBOLS.GBP).toBe('£')
    })

    it('should have exactly 3 currencies', () => {
      expect(Object.keys(CURRENCY_SYMBOLS)).toHaveLength(3)
    })
  })

  describe('CURRENCY_EXCHANGE_RATES', () => {
    it('should have USD as base currency (rate 1)', () => {
      expect(CURRENCY_EXCHANGE_RATES.USD).toBe(1)
    })

    it('should have EUR rate less than 1', () => {
      expect(CURRENCY_EXCHANGE_RATES.EUR).toBeLessThan(1)
      expect(CURRENCY_EXCHANGE_RATES.EUR).toBeGreaterThan(0)
    })

    it('should have GBP rate less than 1', () => {
      expect(CURRENCY_EXCHANGE_RATES.GBP).toBeLessThan(1)
      expect(CURRENCY_EXCHANGE_RATES.GBP).toBeGreaterThan(0)
    })

    it('should have exactly 3 exchange rates', () => {
      expect(Object.keys(CURRENCY_EXCHANGE_RATES)).toHaveLength(3)
    })

    it('should have reasonable exchange rates', () => {
      // Sanity check - rates should be between 0.5 and 1.5
      Object.values(CURRENCY_EXCHANGE_RATES).forEach((rate) => {
        expect(rate).toBeGreaterThan(0.5)
        expect(rate).toBeLessThan(1.5)
      })
    })
  })
})
