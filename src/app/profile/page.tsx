'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

const grades = [
  { label: 'C', score: 50 }, { label: 'C+', score: 55 }, { label: 'B', score: 60 },
  { label: 'B+', score: 65 }, { label: 'A', score: 70 }, { label: 'A+', score: 80 },
];
const scoreToGrade = (score: number | null) => grades.find((item) => item.score === score)?.label || 'B+';

export default function Profile() {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<any>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;
      if (!user) { setLoading(false); return; }
      const { data, error: loadError } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (!alive) return;
      if (loadError) setError('Profilni yuklashda muammo yuz berdi.');
      setProfile(data ?? { name: user.user_metadata?.name || '', daily_study_minutes: 60 });
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [supabase]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Sessiya topilmadi. Qayta kiring.'); setSaving(false); return; }
    const grade = grades.find((item) => item.label === (profile.target_grade || scoreToGrade(profile.target_score))) || grades[3];
    const { error: saveError } = await supabase.from('profiles').update({
      name: String(profile.name || '').trim(),
      username: profile.username?.trim() || null,
      preferred_language: profile.preferred_language || 'uz',
      target_score: grade.score,
      exam_date: profile.exam_date || null,
      current_level: profile.current_level || null,
      daily_study_minutes: Math.min(720, Math.max(15, Number(profile.daily_study_minutes) || 60)),
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    if (saveError) setError('Profilni saqlashda muammo yuz berdi. Username band bo‘lishi mumkin.');
    else setMessage('Profil muvaffaqiyatli saqlandi.');
    setSaving(false);
  }

  if (loading) return <main className="state-page"><div className="loading-card"><span className="loading-dot" /> Profil yuklanmoqda…</div></main>;

  const grade = profile.target_grade || scoreToGrade(profile.target_score);

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/analytics">Analytics</Link><Link href="/study-plan">Study Plan</Link></nav></header>
        <section className="dash-wrap profile-page">
          <div className="dash-head"><div><div className="kicker">SOZLAMALAR</div><h1>Profilingiz.</h1><p>Imtihon maqsadingizni yangilang — Dashboard va Study Plan shu ma’lumotlardan foydalanadi.</p></div></div>
          <form className="form-card profile-form" onSubmit={save}>
            <label>Ism<input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} autoComplete="name" /></label>
            <label>Username<input value={profile.username || ''} onChange={e => setProfile({ ...profile, username: e.target.value })} autoComplete="username" /></label>
            <label>Til<select value={profile.preferred_language || 'uz'} onChange={e => setProfile({ ...profile, preferred_language: e.target.value })}><option value="uz">O‘zbek</option><option value="ru">Русский</option><option value="en">English</option></select></label>
            <label>Maqsad daraja<select value={grade} onChange={e => setProfile({ ...profile, target_grade: e.target.value })}>{grades.map((item) => <option key={item.label}>{item.label}</option>)}</select></label>
            <label>Imtihon sanasi<input type="date" value={profile.exam_date || ''} min={new Date().toISOString().slice(0, 10)} onChange={e => setProfile({ ...profile, exam_date: e.target.value })} /></label>
            <label>Hozirgi daraja<select value={profile.current_level || ''} onChange={e => setProfile({ ...profile, current_level: e.target.value })}><option value="">Tanlang</option><option>Boshlang‘ich</option><option>O‘rta</option><option>Yaxshi</option><option>Yuqori</option></select></label>
            <label>Kunlik o‘qish vaqti<input type="number" min="15" max="720" value={profile.daily_study_minutes || 60} onChange={e => setProfile({ ...profile, daily_study_minutes: e.target.value })} /></label>
            {error && <div className="error-box" role="alert">{error}</div>}
            {message && <div className="success-box" role="status">{message}</div>}
            <button className="primary" disabled={saving}>{saving ? 'Saqlanmoqda…' : 'O‘zgarishlarni saqlash →'}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
