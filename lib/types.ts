export type Category =
  | 'dining'
  | 'groceries'
  | 'gas'
  | 'travel'
  | 'online_shopping'
  | 'streaming'
  | 'drugstore'
  | 'other';

export const CATEGORIES: Category[] = [
  'dining', 'groceries', 'gas', 'travel',
  'online_shopping', 'streaming', 'drugstore', 'other'
];

export const CATEGORY_LABELS: Record<Category, string> = {
  dining: '🍽️ Dining',
  groceries: '🛒 Groceries',
  gas: '⛽ Gas',
  travel: '✈️ Travel',
  online_shopping: '🛍️ Online Shopping',
  streaming: '📺 Streaming',
  drugstore: '💊 Drugstore',
  other: '💳 Other',
};

export interface CashbackRule {
  category: Category | 'all';
  rate: number;
  cap?: number;
  capPeriod?: 'monthly' | 'quarterly';
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  color: string;
  rules: CashbackRule[];
  choosableCategory?: Category;
  isChooosable?: boolean;
  signupBonus?: number;
  notes?: string;
  rotatingCategoryNote?: string;
  rotatingCategoryExpiry?: string;
}

export interface MonthlySpending {
  [category: string]: number;
}

export interface CategoryRecommendation {
  category: Category;
  monthlySpend: number;
  bestCard: CreditCard;
  cashbackRate: number;
  monthlyEarned: number;
}

export interface OptimizationResult {
  recommendations: CategoryRecommendation[];
  totalMonthlyEarned: number;
  totalAnnualEarned: number;
  byCard: Record<string, number>;
}