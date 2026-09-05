import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json();
  const subject_id = String(body.subject_id ?? ''); const name = String(body.name ?? '').trim(); const slug = String(body.slug ?? '').trim().toLowerCase();
  if (!subject_id || !name || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase.from('topics').insert({ subject_id, name, slug, sort_order: Number(body.sort_order ?? 0) }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const body = await req.json(); const id = String(body.id ?? ''); if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const patch: Record<string, unknown> = {};
  for (const key of ['subject_id','name','slug','sort_order']) if (body[key] !== undefined) patch[key] = key === 'sort_order' ? Number(body[key]) : String(body[key]).trim();
  const supabase = await createClient(); const { data, error } = await supabase.from('topics').update(patch).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin(); if (!admin.ok) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const id = new URL(req.url).searchParams.get('id'); if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = await createClient(); const { error } = await supabase.from('topics').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ ok: true });
}
