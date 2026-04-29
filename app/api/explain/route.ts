import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { recommendations, spending, cards } = await request.json();

    const prompt = `You are a personal finance expert specializing in credit card optimization.
    
A user has the following monthly spending:
${Object.entries(spending).map(([cat, amount]) => `- ${cat}: $${amount}`).join('\n')}

Their current credit cards are:
${cards.map((c: { name: string; issuer: string }) => `- ${c.name} by ${c.issuer}`).join('\n')}

The optimizer has recommended the following cards per category:
${recommendations.map((r: { category: string; bestCard: { name: string }; cashbackRate: number; monthlyEarned: number }) =>
  `- ${r.category}: Use ${r.bestCard.name} (${(r.cashbackRate * 100).toFixed(1)}% back, $${r.monthlyEarned.toFixed(2)}/mo)`
).join('\n')}

Please provide:
1. A brief 2-3 sentence summary of their overall cashback strategy
2. The single biggest opportunity they might be missing
3. One actionable tip they can apply immediately

Keep it conversational, concise and friendly. No bullet points, just natural paragraphs.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return NextResponse.json({ error: 'Failed to get explanation' }, { status: 500 });
  }
}