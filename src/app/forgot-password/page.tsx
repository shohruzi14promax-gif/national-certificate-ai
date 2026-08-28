'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function Forgot() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setMessage(''); setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (resetError) setError('Tiklash havolasini yuborishda muammo yuz berdi. Qayta urinib ko‘ring.');
    else setMessage('Agar bu email ro‘yxatdan o‘tgan bo‘lsa, parolni tiklash havolasi yuborildi.');
    setLoading(false);
  }

  return <main className="auth-page"><div className="auth-card"><Link href="/login" className="brand">← Kirishga qaytish</Link><div className="kicker">PAROLNI TIKLASH</div><h1>Parolni unutdingizmi?</h1><p>Email manzilingizni kiriting. Sizga xavfsiz tiklash havolasini yuboramiz.</p><form onSubmit={submit} className="form-card"><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>{error && <div className="error-box" role="alert">{error}</div>}{message && <div className="success-box" role="status">{message}</div>}<button className="primary" disabled={loading}>{loading ? 'Yuborilmoqda…' : 'Tiklash havolasini yuborish'}</button></form></div></main>;
}
