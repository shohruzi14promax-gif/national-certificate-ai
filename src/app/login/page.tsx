'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message.toLowerCase().includes('invalid login credentials') ? 'Email yoki parol noto‘g‘ri.' : 'Kirishda muammo yuz berdi. Ma’lumotlarni tekshirib, qayta urinib ko‘ring.');
      setLoading(false); return;
    }
    router.push('/dashboard'); router.refresh();
  }

  return <main className="auth-page"><div className="auth-card"><Link href="/" className="brand"><span className="brand-mark">M</span> MilliyTest</Link><div className="kicker">KIRISH</div><h1>Xush kelibsiz.</h1><p>Tayyorgarligingizni davom ettirish uchun hisobingizga kiring.</p><form onSubmit={submit} className="form-card"><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label><label>Parol<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>{error && <div className="error-box" role="alert">{error}</div>}<button className="primary" disabled={loading}>{loading ? 'Kirilmoqda…' : 'Kirish →'}</button></form><div className="auth-links"><Link href="/forgot-password">Parolni unutdingizmi?</Link><span>Hisob yo‘qmi? <Link href="/register">Ro‘yxatdan o‘tish</Link></span></div></div></main>;
}
