'use client';

import { useState } from 'react';
import { KNOWN_CARDS } from '@/data/knownCards';
import { optimizeSpending, suggestChoosableCategory } from '@/lib/cardEngine';
import { CreditCard, Category, MonthlySpending, CATEGORIES, CATEGORY_LABELS } from '@/lib/types';

const DEFAULT_SPENDING: MonthlySpending = {
  dining: 400,
  groceries: 600,
  gas: 150,
  travel: 200,
  online_shopping: 300,
  streaming: 50,
  drugstore: 80,
  other: 200,
};

export default function Home() {
  const [myCards, setMyCards] = useState<CreditCard[]>([
    KNOWN_CARDS[0],
    KNOWN_CARDS[1],
    KNOWN_CARDS[5],
  ]);
  const [spending, setSpending] = useState<MonthlySpending>(DEFAULT_SPENDING);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [explanation, setExplanation] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const result = optimizeSpending(myCards, spending);
  const choosableSuggestions = myCards
    .filter(c => c.isChooosable)
    .map(card => ({ card, ...suggestChoosableCategory(card, spending, myCards) }));

  const toggleCard = (card: CreditCard) => {
    setMyCards(prev =>
      prev.find(c => c.id === card.id)
        ? prev.filter(c => c.id !== card.id)
        : [...prev, card]
    );
  };

  const updateChoosableCategory = (cardId: string, category: Category) => {
    setMyCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, choosableCategory: category } : c)
    );
  };

  const handleExplain = async () => {
    setLoadingExplanation(true);
    setExplanation('');
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendations: result.recommendations,
          spending,
          cards: myCards,
        }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation('Sorry, something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">💳 Credit Card Optimizer</h1>
      <p className="text-gray-400 mb-8">Find the best card for every purchase category</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Inputs */}
        <div className="space-y-6">

          {/* My Cards */}
          <section className="bg-gray-900 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">My Cards ({myCards.length})</h2>
              <button
                onClick={() => setShowCardPicker(!showCardPicker)}
                className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg">
                {showCardPicker ? 'Done' : '+ Add / Remove'}
              </button>
            </div>

            {showCardPicker && (
              <div className="mb-4 space-y-2">
                {KNOWN_CARDS.map(card => (
                  <label key={card.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!myCards.find(c => c.id === card.id)}
                      onChange={() => toggleCard(card)}
                      className="w-4 h-4" />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: card.color }} />
                    <span className="text-sm">{card.name}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {myCards.map(card => (
                <div key={card.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: card.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{card.name}</p>
                    {card.isChooosable && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-400">3% category:</span>
                        <select
                          value={card.choosableCategory}
                          onChange={e => updateChoosableCategory(card.id, e.target.value as Category)}
                          className="text-xs bg-gray-700 rounded px-2 py-0.5 text-white">
                          {CATEGORIES.filter(c => c !== 'other' && c !== 'streaming').map(cat => (
                            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Spending Sliders */}
          <section className="bg-gray-900 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Monthly Spending</h2>
            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{CATEGORY_LABELS[cat]}</span>
                    <span className="font-mono text-green-400">${spending[cat] ?? 0}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={25}
                    value={spending[cat] ?? 0}
                    onChange={e => setSpending(prev => ({ ...prev, [cat]: Number(e.target.value) }))}
                    className="w-full accent-blue-500" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-6">

          {/* Summary */}
          <section className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-3">Projected Earnings</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-300 text-sm">Monthly</p>
                <p className="text-3xl font-bold">${result.totalMonthlyEarned.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-300 text-sm">Annual</p>
                <p className="text-3xl font-bold">${result.totalAnnualEarned.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-blue-300 text-xs mt-3">
              * Point-based cards (e.g. Hilton Aspire) are converted to estimated cash value
              at 0.5 cents per point. Actual value may vary based on how you redeem.
            </p>
          </section>

          {/* AI Explanation */}
          <section className="bg-gray-900 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">🤖 AI Analysis</h2>
              <button
                onClick={handleExplain}
                disabled={loadingExplanation || result.recommendations.length === 0}
                className="text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 px-3 py-1 rounded-lg transition-colors">
                {loadingExplanation ? 'Thinking...' : 'Explain my results'}
              </button>
            </div>
            {explanation ? (
              <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
            ) : (
              <p className="text-gray-600 text-sm">
                Click the button to get a plain English explanation of your results and personalized tips.
              </p>
            )}
          </section>

          {/* Choosable Category Suggestions */}
          {choosableSuggestions.length > 0 && (
            <section className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-3">🎯 Category Suggestions</h2>
              {choosableSuggestions.map(({ card, suggestedCategory, gainVsCurrent }) => (
                <div key={card.id} className="text-sm">
                  <p className="text-yellow-300 font-medium">{card.name}</p>
                  {card.choosableCategory === suggestedCategory ? (
                    <p className="text-green-400">
                      Your chosen category ({CATEGORY_LABELS[suggestedCategory]}) is optimal!
                    </p>
                  ) : (
                    <div>
                      <p className="text-gray-300">
                        Switch to{' '}
                        <span className="text-yellow-300 font-bold">
                          {CATEGORY_LABELS[suggestedCategory]}
                        </span>{' '}
                        to earn +${gainVsCurrent.toFixed(2)}/mo more
                      </p>
                      <button
                        onClick={() => updateChoosableCategory(card.id, suggestedCategory)}
                        className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded-lg">
                        Apply Suggestion
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Per-Category Recommendations */}
          <section className="bg-gray-900 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Best Card Per Category</h2>
            {result.recommendations.length === 0 ? (
              <p className="text-gray-500">Add spending amounts to see recommendations</p>
            ) : (
              <div className="space-y-3">
                {result.recommendations
                  .sort((a, b) => b.monthlyEarned - a.monthlyEarned)
                  .map(rec => (
                    <div key={rec.category} className="flex flex-col gap-1 p-3 bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: rec.bestCard.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              {CATEGORY_LABELS[rec.category]}
                            </span>
                            <span className="text-green-400 font-mono text-sm">
                              +${rec.monthlyEarned.toFixed(2)}/mo
                            </span>
                          </div>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-xs text-gray-400 truncate">
                              {rec.bestCard.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(rec.cashbackRate * 100).toFixed(1)}% back
                            </span>
                          </div>
                        </div>
                      </div>

                      {rec.bestCard.id === 'chase-freedom-flex' &&
                        (rec.category === 'online_shopping' || rec.category === 'groceries') && (
                        <div className="ml-6 mt-1 text-xs text-yellow-400 bg-yellow-900/30 rounded-lg px-2 py-1">
                          Rotating category - expires June 30, 2026.{' '}
                          <a
                            href="https://www.chase.com/personal/credit-cards/freedom/flex"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-yellow-300">
                            Check current categories
                          </a>
                        </div>
                      )}

                      {rec.bestCard.id === 'amex-hilton-aspire' && (
                        <div className="ml-6 mt-1 text-xs text-amber-400 bg-amber-900/30 rounded-lg px-2 py-1">
                          Estimated cash value of Hilton points at 0.5 cents each. Actual value varies by redemption.
                        </div>
                      )}

                    </div>
                  ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
