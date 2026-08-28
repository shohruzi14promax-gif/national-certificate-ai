'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Registration is handled server-side so the service-role key never
      // reaches the browser. The server creates the user as already confirmed.
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
        setLoading(false);
        return;
      }

      // Create the normal browser session after the confirmed account exists.
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError('Hisob yaratildi, lekin avtomatik kirish ishlamadi. Iltimos, Kirish orqali davom eting.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Server bilan bog‘lanib bo‘lmadi. Keyinroq qayta urinib ko‘ring.');
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="brand-mark">N</span> National Certificate AI</Link>
        <div className="kicker">RO‘YXATDAN O‘TISH</div>
        <h1>Tayyorgarlikni boshlang.</h1>
        <p>Bepul hisob yarating va natijalaringizni saqlang.</p>

        <form onSubmit={submit} className="form-card">
          <label>Ism<input value={name} onChange={e => setName(e.target.value)} required /></label>
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label>Parol<input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required /></label>
          {error && <div className="error-box" role="alert">{error}</div>}
          <button className="primary" disabled={loading}>{loading ? 'Yaratilmoqda…' : 'Hisob yaratish →'}</button>
        </form>

        <div className="auth-links"><span>Hisobingiz bormi? <Link href="/login">Kirish</Link></span></div>
      </div>
    </main>
  );
}
