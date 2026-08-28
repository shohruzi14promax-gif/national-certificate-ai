import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const bodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  password: z.string().min(6).max(128),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { name: body.name },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, userId: data.user.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ma’lumotlarni tekshiring.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ro‘yxatdan o‘tishda xatolik yuz berdi.' },
      { status: 500 },
    );
  }
}
