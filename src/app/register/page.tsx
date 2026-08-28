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
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

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

    // With Supabase email confirmation disabled, signup returns a session
    // and the user goes straight into the application.
    if (data.session) {
      router.push('/dashboard');
      return;
    }

    // Do not present an email-confirmation flow in the product. If Supabase
    // returns no session, its Auth configuration still requires confirmation.
    setError('Avtomatik kirish ishlamadi. Supabase Auth sozlamasida email confirmation o‘chirilganini tekshiring.');
    setLoading(false);
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
