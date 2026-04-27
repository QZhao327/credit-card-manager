import { CreditCard } from '@/lib/types';

export const KNOWN_CARDS: CreditCard[] = [
  {
    id: 'bofa-customized-cash',
    name: 'BofA Customized Cash Rewards',
    issuer: 'Bank of America',
    annualFee: 0,
    color: '#C8102E',
    isChooosable: true,
    choosableCategory: 'online_shopping',
    rules: [
      { category: 'online_shopping', rate: 0.03, cap: 2500, capPeriod: 'quarterly' },
      { category: 'groceries', rate: 0.02 },
      { category: 'dining', rate: 0.02 },
      { category: 'all', rate: 0.01 },
    ],
    notes: '3% on chosen category, 2% groceries & dining, 1% everything else. $2,500 quarterly cap on 3%+2%.',
  },
  {
    id: 'citi-double-cash',
    name: 'Citi Double Cash',
    issuer: 'Citi',
    annualFee: 0,
    color: '#003B70',
    rules: [
      { category: 'all', rate: 0.02 },
    ],
    notes: '2% on everything (1% when you buy + 1% when you pay).',
  },
  {
    id: 'chase-sapphire-preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    annualFee: 95,
    color: '#1A1A2E',
    rules: [
      { category: 'dining', rate: 0.03 },
      { category: 'travel', rate: 0.02 },
      { category: 'streaming', rate: 0.03 },
      { category: 'groceries', rate: 0.03 },
      { category: 'all', rate: 0.01 },
    ],
    notes: '3x dining, streaming, groceries. 2x travel. 1x everything else.',
  },
  {
    id: 'amex-blue-cash-preferred',
    name: 'Amex Blue Cash Preferred',
    issuer: 'American Express',
    annualFee: 95,
    color: '#007BC1',
    rules: [
      { category: 'groceries', rate: 0.06, cap: 6000, capPeriod: 'monthly' },
      { category: 'streaming', rate: 0.06 },
      { category: 'gas', rate: 0.03 },
      { category: 'dining', rate: 0.03 },
      { category: 'all', rate: 0.01 },
    ],
    notes: '6% groceries (up to $6k/yr), 6% streaming, 3% gas, 1% everything else.',
  },
  {
    id: 'discover-it',
    name: 'Discover It Cash Back',
    issuer: 'Discover',
    annualFee: 0,
    color: '#FF6B00',
    rules: [
      { category: 'dining', rate: 0.05, cap: 1500, capPeriod: 'quarterly' },
      { category: 'groceries', rate: 0.05, cap: 1500, capPeriod: 'quarterly' },
      { category: 'all', rate: 0.01 },
    ],
    notes: '5% rotating categories (up to $1,500/quarter), 1% everything else.',
  },
  {
    id: 'chase-freedom-unlimited',
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    annualFee: 0,
    color: '#4A90D9',
    rules: [
      { category: 'dining', rate: 0.03 },
      { category: 'drugstore', rate: 0.03 },
      { category: 'travel', rate: 0.05 },
      { category: 'all', rate: 0.015 },
    ],
    notes: '5% Chase travel, 3% dining & drugstores, 1.5% everything else.',
  },
  {
    id: 'citi-custom-cash',
    name: 'Citi Custom Cash',
    issuer: 'Citi',
    annualFee: 0,
    color: '#00A3E0',
    isChooosable: true,
    choosableCategory: 'dining',
    rules: [
      { category: 'dining', rate: 0.05, cap: 500, capPeriod: 'monthly' },
      { category: 'all', rate: 0.01 },
    ],
    notes: '5% on your top spend category each month (up to $500/month), 1% everything else.',
  },
  {
    id: 'wells-fargo-active-cash',
    name: 'Wells Fargo Active Cash',
    issuer: 'Wells Fargo',
    annualFee: 0,
    color: '#D71E28',
    rules: [
      { category: 'all', rate: 0.02 },
    ],
    notes: 'Unlimited 2% cash rewards on all purchases.',
  },
  // --- USER'S PERSONAL CARDS ---
  {
    id: 'amex-hilton-aspire',
    name: 'Amex Hilton Honors Aspire',
    issuer: 'American Express',
    annualFee: 550,
    color: '#C9A84C',
    rules: [
      // 14x points at Hilton → 14 × 0.5¢ = 7% effective cashback
      // No direct "travel" category in our app maps to Hilton hotels,
      // so we use travel as the closest proxy
      { category: 'travel', rate: 0.07 },
      // 7x points on dining & flights → 7 × 0.5¢ = 3.5%
      { category: 'dining', rate: 0.035 },
      // 3x points on everything else → 3 × 0.5¢ = 1.5%
      { category: 'all', rate: 0.015 },
    ],
    notes: 'Earns Hilton Honors points, converted at 0.5¢/point (conservative estimate). 14x at Hilton hotels (≈7%), 7x dining & travel (≈3.5%), 3x all else (≈1.5%). Actual value varies by redemption.',
  },
  {
    id: 'chase-freedom-flex',
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    annualFee: 0,
    color: '#1A6BC4',
    rotatingCategoryNote: 'Q2 2026 (Apr–Jun): Amazon, Whole Foods, Chase Travel — 5% up to $1,500. Check current categories at chase.com/freedomflex',
    rotatingCategoryExpiry: 'June 30, 2026',
    rules: [
      // Rotating 5% — Q2 2026: Amazon = online_shopping, Whole Foods = groceries
      { category: 'online_shopping', rate: 0.05, cap: 1500, capPeriod: 'quarterly' },
      { category: 'groceries', rate: 0.05, cap: 1500, capPeriod: 'quarterly' },
      // Permanent categories
      { category: 'dining', rate: 0.03 },
      { category: 'drugstore', rate: 0.03 },
      { category: 'travel', rate: 0.05 },
      { category: 'all', rate: 0.01 },
    ],
    notes: 'Q2 2026 rotating 5%: Amazon & Whole Foods (expires June 30, 2026). Always 3% dining & drugstores, 5% Chase Travel, 1% everything else. Check chase.com/freedomflex each quarter.',
  },
  {
    id: 'amazon-prime-visa',
    name: 'Amazon Prime Visa',
    issuer: 'Chase',
    annualFee: 0,
    color: '#FF9900',
    rules: [
      // 5% at Amazon, Whole Foods, Amazon Fresh, Chase Travel (with Prime)
      { category: 'online_shopping', rate: 0.05 },
      { category: 'groceries', rate: 0.05 },
      { category: 'travel', rate: 0.05 },
      // 2% at restaurants and gas
      { category: 'dining', rate: 0.02 },
      { category: 'gas', rate: 0.02 },
      { category: 'all', rate: 0.01 },
    ],
    notes: '5% at Amazon, Whole Foods & Chase Travel (requires Prime membership), 2% dining & gas, 1% everything else.',
  },
];