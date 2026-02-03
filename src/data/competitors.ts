export interface CompetitorTier {
  units: number;
  monthly: number;
  annual: number;
}

export interface Competitor {
  id: 'zapier' | 'make' | 'n8n';
  name: string;
  unitName: string;
  unitMapping: number;
  pricingUrl: string;
  lastVerified: string;
  tiers: CompetitorTier[];
  features: {
    selfHosted: boolean;
    embedded: boolean;
    unlimitedOption: boolean;
    connectorCount: string;
  };
  advantages: string[];
  limitations: string[];
  bestFor: string;
}

export const competitors: Competitor[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    unitName: 'task',
    unitMapping: 1.0,
    pricingUrl: 'https://zapier.com/pricing',
    lastVerified: '2026-02-03',
    tiers: [
      { units: 100, monthly: 0, annual: 0 },
      { units: 750, monthly: 19.99, annual: 240 },
      { units: 2000, monthly: 49, annual: 588 },
      { units: 3000, monthly: 69, annual: 828 },
      { units: 5000, monthly: 99, annual: 1188 },
      { units: 10000, monthly: 149, annual: 1788 },
      { units: 20000, monthly: 249, annual: 2988 },
      { units: 50000, monthly: 399, annual: 4788 },
      { units: 100000, monthly: 599, annual: 7188 },
      { units: 200000, monthly: 799, annual: 9588 },
      { units: 500000, monthly: 999, annual: 11988 },
      { units: 1000000, monthly: 1499, annual: 17988 },
      { units: 1500000, monthly: 1999, annual: 23988 },
      { units: 2000000, monthly: 2499, annual: 29988 },
    ],
    features: {
      selfHosted: false,
      embedded: false,
      unlimitedOption: false,
      connectorCount: '7,000+',
    },
    advantages: [
      'Largest connector ecosystem (7,000+ apps)',
      'Most recognized brand — easy stakeholder buy-in',
      'Best for non-technical users',
    ],
    limitations: [
      'No self-hosted deployment option',
      'No embedded/white-label capability',
      'Task-based pricing scales expensively',
    ],
    bestFor: 'Simple workflows, non-technical teams, wide app coverage',
  },
  {
    id: 'make',
    name: 'Make',
    unitName: 'operation',
    unitMapping: 1.5,
    pricingUrl: 'https://make.com/en/pricing',
    lastVerified: '2026-02-03',
    tiers: [
      { units: 1000, monthly: 0, annual: 0 },
      { units: 10000, monthly: 9, annual: 108 },
      { units: 40000, monthly: 16, annual: 192 },
      { units: 150000, monthly: 29, annual: 348 },
      { units: 800000, monthly: 99, annual: 1188 },
    ],
    features: {
      selfHosted: false,
      embedded: false,
      unlimitedOption: false,
      connectorCount: '1,500+',
    },
    advantages: [
      'Most affordable for low-to-medium volume',
      'Excellent visual workflow builder',
      'Strong conditional logic and data transformation',
    ],
    limitations: [
      'No self-hosted deployment option',
      'No embedded/white-label capability',
      'Operation counting can be confusing',
    ],
    bestFor: 'Budget-conscious teams, complex visual workflows',
  },
  {
    id: 'n8n',
    name: 'n8n',
    unitName: 'execution',
    unitMapping: 0.3,
    pricingUrl: 'https://n8n.io/pricing',
    lastVerified: '2026-02-03',
    tiers: [
      { units: 0, monthly: 0, annual: 0 },
      { units: 2500, monthly: 20, annual: 240 },
      { units: 10000, monthly: 50, annual: 600 },
    ],
    features: {
      selfHosted: true,
      embedded: false,
      unlimitedOption: true,
      connectorCount: '400+',
    },
    advantages: [
      'Free self-hosted option with unlimited executions',
      'Open source — full transparency and customization',
      'Strong developer community',
    ],
    limitations: [
      'No embedded/white-label capability',
      'Smaller connector library',
      'Self-hosted requires DevOps expertise',
    ],
    bestFor: 'Technical teams wanting self-hosted, developers, budget with DIY',
  },
];

export const appmixerAdvantages = [
  'Self-hosted deployment option',
  'Embedded white-label for your SaaS',
  'Predictable pricing without per-task limits',
  'API-first architecture',
];
