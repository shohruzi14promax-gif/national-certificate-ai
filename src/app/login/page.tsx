'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function LoginPage() {
  const supabase = createClient(); const router = useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)setError(error.message);else router.push('/dashboard');setLoading(false);}
  return <main className="auth-page"><div className="auth-card"><Link href="/" className="brand"><span className="brand-mark">M</span> MilliyTest</Link><div className="kicker">KIRISH</div><h1>Xush kelibsiz.</h1><p>Davom etish uchun hisobingizga kiring.</p><form onSubmit={submit} className="form-card"><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Parol<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>{error&&<div className="error-box">{error}</div>}<button className="primary" disabled={loading}>{loading?'Kirilmoqda…':'Kirish →'}</button></form><div className="auth-links"><Link href="/forgot-password">Parolni unutdingizmi?</Link><span>Hisob yo‘qmi? <Link href="/register">Ro‘yxatdan o‘tish</Link></span></div></div></main>;
}
