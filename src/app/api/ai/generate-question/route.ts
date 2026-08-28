import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';

const output = z.object({
  question: z.string().min(1),
  options: z.array(z.object({ key: z.enum(['A', 'B', 'C', 'D']), text: z.string().min(1) })).length(4),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().min(1),
  subject: z.string(),
  topic: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const input = z.object({ subject: z.string().trim().min(1).max(100), topic: z.string().trim().min(1).max(150), difficulty: z.enum(['easy', 'medium', 'hard']) }).parse(await req.json());
    const key = process.env.AI_PROVIDER_API_KEY;
    const base = process.env.AI_PROVIDER_BASE_URL;
    const model = process.env.AI_MODEL || 'gpt-4o-mini';
    if (!key || !base) return NextResponse.json({ error: 'AI provider sozlanmagan.' }, { status: 503 });
    const response = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Generate one original National Certificate practice question. It is not official exam material. Return only JSON matching the requested schema.' }, { role: 'user', content: JSON.stringify(input) }] }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return NextResponse.json({ error: 'AI xizmatidan javob olishda muammo yuz berdi.' }, { status: 502 });
    const json = await response.json();
    const raw = JSON.parse(String(json.choices?.[0]?.message?.content || '{}'));
    const parsed = output.parse(raw);
    return NextResponse.json({ ...parsed, source_type: 'ai_generated', official: false });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Savol parametrlari noto‘g‘ri.' }, { status: 400 });
    if (error instanceof Error && error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Bu amal faqat administrator uchun.' }, { status: 403 });
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Avval hisobingizga kiring.' }, { status: 401 });
    console.error('AI question generation failed', error);
    return NextResponse.json({ error: 'AI savol yaratishda muammo yuz berdi.' }, { status: 500 });
  }
}
