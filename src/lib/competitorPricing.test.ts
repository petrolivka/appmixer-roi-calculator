import { describe, it, expect } from 'vitest'
import {
  calculateCompetitorCost,
  calculateAllCompetitors,
  formatCompetitorCost,
} from './competitorPricing'

describe('calculateCompetitorCost', () => {
  describe('Zapier', () => {
    it('should calculate cost for 10K operations (1:1 mapping)', () => {
      const result = calculateCompetitorCost('zapier', 10000, 5000)
      
      expect(result).not.toBeNull()
      expect(result!.monthlyUnits).toBe(10000) // 1:1 mapping
      expect(result!.annualCost).toBe(1788) // $149/mo tier for 10K tasks
      expect(result!.monthlyCost).toBe(149)
    })

    it('should select correct tier for 50K operations', () => {
      const result = calculateCompetitorCost('zapier', 50000, 5000)
      
      expect(result!.monthlyUnits).toBe(50000)
      expect(result!.annualCost).toBe(4788) // $399/mo tier
    })

    it('should use highest tier for very high volume', () => {
      const result = calculateCompetitorCost('zapier', 3000000, 50000)
      
      expect(result!.annualCost).toBe(29988) // Max tier $2499/mo
    })

    it('should return free tier for low volume', () => {
      const result = calculateCompetitorCost('zapier', 50, 1000)
      
      expect(result!.annualCost).toBe(0)
      expect(result!.monthlyCost).toBe(0)
    })
  })

  describe('Make', () => {
    it('should apply 1.5x multiplier for operations', () => {
      const result = calculateCompetitorCost('make', 10000, 5000)
      
      expect(result).not.toBeNull()
      expect(result!.monthlyUnits).toBe(15000) // 10K * 1.5
    })

    it('should select correct tier based on mapped operations', () => {
      // 10K ops * 1.5 = 15K Make operations -> $16/mo tier (40K)
      const result = calculateCompetitorCost('make', 10000, 5000)
      
      expect(result!.annualCost).toBe(192) // $16/mo tier
    })

    it('should return free tier for very low volume', () => {
      const result = calculateCompetitorCost('make', 500, 1000)
      
      // 500 * 1.5 = 750 ops, fits in 1000 free tier
      expect(result!.annualCost).toBe(0)
    })
  })

  describe('n8n', () => {
    it('should apply 0.3x multiplier for executions', () => {
      const result = calculateCompetitorCost('n8n', 10000, 5000)
      
      expect(result).not.toBeNull()
      expect(result!.monthlyUnits).toBe(3000) // 10K * 0.3
    })

    it('should select Pro tier for 3K executions', () => {
      const result = calculateCompetitorCost('n8n', 10000, 5000)
      
      // 3K executions -> Pro tier (10K)
      expect(result!.annualCost).toBe(600) // $50/mo
    })

    it('should return Starter tier for lower volume', () => {
      const result = calculateCompetitorCost('n8n', 5000, 3000)
      
      // 5K * 0.3 = 1500 executions -> Starter tier (2500)
      expect(result!.annualCost).toBe(240) // $20/mo
    })
  })

  describe('comparison logic', () => {
    it('should return cheaper = appmixer when competitor costs more', () => {
      // Zapier 100K tasks = $7188/yr, Appmixer = $5000/yr
      const result = calculateCompetitorCost('zapier', 100000, 5000)
      
      expect(result!.vsAppmixer.cheaper).toBe('appmixer')
      expect(result!.vsAppmixer.difference).toBeGreaterThan(0)
    })

    it('should return cheaper = competitor when Appmixer costs more', () => {
      // Make low volume = $108/yr, Appmixer = $10000/yr
      const result = calculateCompetitorCost('make', 5000, 10000)
      
      expect(result!.vsAppmixer.cheaper).toBe('competitor')
      expect(result!.vsAppmixer.difference).toBeLessThan(0)
    })

    it('should return similar when costs are within 10%', () => {
      // Need to find a case where costs are similar
      // Zapier 750 tasks = $240/yr
      const result = calculateCompetitorCost('zapier', 750, 250)
      
      // $240 vs $250 is within 10% (-4%)
      expect(result!.vsAppmixer.cheaper).toBe('similar')
    })

    it('should calculate correct percent difference', () => {
      // Zapier $1788 vs Appmixer $1000 = +78.8%
      const result = calculateCompetitorCost('zapier', 10000, 1000)
      
      expect(result!.vsAppmixer.percentDiff).toBe(79) // Rounded
    })
  })

  it('should return null for unknown competitor', () => {
    const result = calculateCompetitorCost('unknown', 10000, 5000)
    
    expect(result).toBeNull()
  })
})

describe('calculateAllCompetitors', () => {
  it('should return results for all 3 competitors', () => {
    const results = calculateAllCompetitors(10000, 5000)
    
    expect(results).toHaveLength(3)
    expect(results.map((r) => r.competitor.id)).toEqual(['zapier', 'make', 'n8n'])
  })

  it('should calculate different costs for each competitor', () => {
    const results = calculateAllCompetitors(10000, 5000)
    
    const costs = results.map((r) => r.annualCost)
    // Each platform has different pricing, so costs should differ
    // (though some could theoretically be equal)
    expect(new Set(costs).size).toBeGreaterThanOrEqual(2)
  })

  it('should apply correct mappings for each competitor', () => {
    const results = calculateAllCompetitors(10000, 5000)
    
    const zapier = results.find((r) => r.competitor.id === 'zapier')!
    const make = results.find((r) => r.competitor.id === 'make')!
    const n8n = results.find((r) => r.competitor.id === 'n8n')!
    
    expect(zapier.monthlyUnits).toBe(10000) // 1.0x
    expect(make.monthlyUnits).toBe(15000)   // 1.5x
    expect(n8n.monthlyUnits).toBe(3000)     // 0.3x
  })
})

describe('formatCompetitorCost', () => {
  it('should format USD correctly', () => {
    expect(formatCompetitorCost(1234, 'USD')).toBe('$1,234')
  })

  it('should format EUR correctly', () => {
    expect(formatCompetitorCost(1234, 'EUR')).toBe('€1,234')
  })

  it('should format GBP correctly', () => {
    expect(formatCompetitorCost(1234, 'GBP')).toBe('£1,234')
  })

  it('should handle zero', () => {
    expect(formatCompetitorCost(0, 'USD')).toBe('$0')
  })

  it('should round to whole numbers', () => {
    expect(formatCompetitorCost(1234.56, 'USD')).toBe('$1,235')
  })
})

describe('competitor data integrity', () => {
  it('should have Zapier tiers in ascending order', () => {
    const result = calculateCompetitorCost('zapier', 100, 1000)
    const tiers = result!.competitor.tiers
    
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].units).toBeGreaterThan(tiers[i - 1].units)
      expect(tiers[i].annual).toBeGreaterThanOrEqual(tiers[i - 1].annual)
    }
  })

  it('should have Make tiers in ascending order', () => {
    const result = calculateCompetitorCost('make', 100, 1000)
    const tiers = result!.competitor.tiers
    
    for (let i = 1; i < tiers.length; i++) {
      expect(tiers[i].units).toBeGreaterThan(tiers[i - 1].units)
    }
  })

  it('should have all required competitor fields', () => {
    const results = calculateAllCompetitors(10000, 5000)
    
    for (const result of results) {
      const c = result.competitor
      expect(c.id).toBeDefined()
      expect(c.name).toBeDefined()
      expect(c.unitName).toBeDefined()
      expect(c.pricingUrl).toMatch(/^https?:\/\//)
      expect(c.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(c.advantages.length).toBeGreaterThan(0)
      expect(c.limitations.length).toBeGreaterThan(0)
      expect(c.bestFor).toBeDefined()
    }
  })
})
