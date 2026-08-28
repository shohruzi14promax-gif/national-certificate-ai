'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function RegisterPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      return;
    }

    // Supabase can create the account without returning a session when
    // email confirmation is enabled. This is a successful registration,
    // not an error condition.
    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="brand"><span className="brand-mark">N</span> National Certificate AI</Link>
        <div className="kicker">RO‘YXATDAN O‘TISH</div>
        <h1>Tayyorgarlikni boshlang.</h1>
        <p>Bepul hisob yarating va natijalaringizni saqlang.</p>

        {success ? (
          <div className="form-card">
            <div className="success-box" role="status">
              <strong>Hisob muvaffaqiyatli yaratildi.</strong>
              <p>Email manzilingizni tasdiqlash talab qilinishi mumkin. Tasdiqlagach, hisobingizga kiring.</p>
            </div>
            <div className="auth-actions">
              <Link className="primary" href="/login">Kirish →</Link>
              <Link className="secondary" href="/dashboard">Dashboard</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="form-card">
            <label>Ism<input value={name} onChange={e => setName(e.target.value)} required /></label>
            <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <label>Parol<input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required /></label>
            {error && <div className="error-box" role="alert">{error}</div>}
            <button className="primary" disabled={loading}>{loading ? 'Yaratilmoqda…' : 'Hisob yaratish →'}</button>
          </form>
        )}

        <div className="auth-links"><span>Hisobingiz bormi? <Link href="/login">Kirish</Link></span></div>
      </div>
    </main>
  );
}
