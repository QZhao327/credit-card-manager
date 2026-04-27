import { CreditCard, Category, MonthlySpending, OptimizationResult, CategoryRecommendation, CATEGORIES } from './types';

export function getEffectiveRate(card: CreditCard, category: Category): number {
  const rules = card.rules.map(rule => {
    if (
      card.isChooosable &&
      card.choosableCategory &&
      rule.rate === Math.max(...card.rules.map(r => r.rate))
    ) {
      return { ...rule, category: card.choosableCategory };
    }
    return rule;
  });

  const specificRule = rules.find(r => r.category === category);
  const fallbackRule = rules.find(r => r.category === 'all');

  return specificRule?.rate ?? fallbackRule?.rate ?? 0;
}

export function optimizeSpending(
  cards: CreditCard[],
  spending: MonthlySpending
): OptimizationResult {
  if (cards.length === 0) {
    return { recommendations: [], totalMonthlyEarned: 0, totalAnnualEarned: 0, byCard: {} };
  }

  const recommendations: CategoryRecommendation[] = [];
  const byCard: Record<string, number> = {};

  for (const category of CATEGORIES) {
    const monthlySpend = spending[category] ?? 0;
    if (monthlySpend === 0) continue;

    let bestCard = cards[0];
    let bestRate = getEffectiveRate(cards[0], category);

    for (const card of cards.slice(1)) {
      const rate = getEffectiveRate(card, category);
      if (rate > bestRate) {
        bestRate = rate;
        bestCard = card;
      }
    }

    const monthlyEarned = monthlySpend * bestRate;
    recommendations.push({
      category,
      monthlySpend,
      bestCard,
      cashbackRate: bestRate,
      monthlyEarned,
    });

    byCard[bestCard.id] = (byCard[bestCard.id] ?? 0) + monthlyEarned;
  }

  const totalMonthlyEarned = recommendations.reduce((sum, r) => sum + r.monthlyEarned, 0);

  return {
    recommendations,
    totalMonthlyEarned,
    totalAnnualEarned: totalMonthlyEarned * 12,
    byCard,
  };
}

export function suggestChoosableCategory(
  card: CreditCard,
  spending: MonthlySpending,
  allCards: CreditCard[]
): { suggestedCategory: Category; gainVsCurrent: number } {
  const choosableCategories: Category[] = [
    'dining', 'groceries', 'gas', 'travel', 'online_shopping', 'drugstore'
  ];
  const otherCards = allCards.filter(c => c.id !== card.id);

  let bestCategory = card.choosableCategory ?? 'dining';
  let bestGain = -Infinity;

  for (const cat of choosableCategories) {
    const testCard = { ...card, choosableCategory: cat };
    const myRate = getEffectiveRate(testCard, cat);
    const competitorRate = Math.max(0, ...otherCards.map(c => getEffectiveRate(c, cat)));
    const monthlySpend = spending[cat] ?? 0;
    const gain = monthlySpend * (myRate - competitorRate);

    if (gain > bestGain) {
      bestGain = gain;
      bestCategory = cat;
    }
  }

  return { suggestedCategory: bestCategory, gainVsCurrent: bestGain };
}