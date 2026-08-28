import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';

const schema = z.object({ conversationId: z.string().uuid().optional(), message: z.string().trim().min(1).max(4000), subjectId: z.string().uuid().optional() });

export async function POST(req: Request) {
  try {
    const { supabase, user } = await requireUser();
    const body = schema.parse(await req.json());
    let conversationId = body.conversationId;
    if (!conversationId) {
      const { data, error } = await supabase.from('ai_conversations').insert({ user_id: user.id, subject_id: body.subjectId ?? null, title: body.message.slice(0, 60) }).select('id').single();
      if (error) throw error;
      conversationId = data.id;
    }
    const { data: conversation } = await supabase.from('ai_conversations').select('id').eq('id', conversationId).eq('user_id', user.id).maybeSingle();
    if (!conversation) return NextResponse.json({ error: 'Bu suhbatga kirish mumkin emas.' }, { status: 403 });
    const { error: messageError } = await supabase.from('ai_messages').insert({ conversation_id: conversationId, role: 'user', content: body.message });
    if (messageError) throw messageError;
    const { data: history } = await supabase.from('ai_messages').select('role,content').eq('conversation_id', conversationId).order('created_at').limit(20);

    const key = process.env.AI_PROVIDER_API_KEY;
    const base = process.env.AI_PROVIDER_BASE_URL;
    const model = process.env.AI_MODEL || 'gpt-4o-mini';
    if (!key || !base) return NextResponse.json({ conversationId, reply: 'Tutor hozircha sozlanmagan. AI xizmat sozlamalari qo‘shilgach, shu suhbat ishlaydi.' });

    const response = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You are a calm Uzbek National Certificate tutor. Explain concepts clearly, give hints before answers when useful, and never claim generated content is official exam material.' }, ...(history ?? [])] }),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return NextResponse.json({ conversationId, reply: 'AI tutor hozircha javob bera olmadi. Birozdan keyin qayta urinib ko‘ring.' }, { status: 200 });
    const json = await response.json();
    const reply = String(json.choices?.[0]?.message?.content || 'Javob olinmadi.');
    await supabase.from('ai_messages').insert({ conversation_id: conversationId, role: 'assistant', content: reply });
    return NextResponse.json({ conversationId, reply });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Xabaringizni tekshiring.' }, { status: 400 });
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Avval hisobingizga kiring.' }, { status: 401 });
    console.error('Tutor request failed', error);
    return NextResponse.json({ error: 'Tutor bilan bog‘lanishda muammo yuz berdi. Qayta urinib ko‘ring.' }, { status: 500 });
  }
}
