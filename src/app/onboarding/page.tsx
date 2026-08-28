'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const grades = [
  { label: 'C', score: 50 },
  { label: 'C+', score: 55 },
  { label: 'B', score: 60 },
  { label: 'B+', score: 65 },
  { label: 'A', score: 70 },
  { label: 'A+', score: 80 },
];

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [examDate, setExamDate] = useState('');
  const [target, setTarget] = useState('B+');
  const [minutes, setMinutes] = useState(60);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: { user } }, { data, error: subjectError }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('subjects').select('id,name,icon').order('sort_order'),
      ]);
      if (!alive) return;
      if (!user) { router.replace('/login'); return; }
      setName(user.user_metadata?.name || '');
      if (subjectError) setError('Fanlarni yuklashda muammo yuz berdi.');
      const list = data ?? [];
      setSubjects(list);
      setSelected(list.length ? [list[0].id] : []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [router, supabase]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected.length) { setError('Kamida bitta fan tanlang.'); return; }
    setSaving(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/login'); return; }
    const grade = grades.find((item) => item.label === target) || grades[3];
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      name: name.trim(),
      target_score: grade.score,
      exam_date: examDate || null,
      daily_study_minutes: minutes,
      updated_at: new Date().toISOString(),
    });
    if (profileError) {
      setError('Profilni saqlashda muammo yuz berdi. Qayta urinib ko‘ring.');
      setSaving(false);
      return;
    }
    const { error: subjectsError } = await supabase.from('user_subjects').upsert(selected.map((subject_id) => ({ user_id: user.id, subject_id })));
    if (subjectsError) {
      setError('Tanlangan fanlarni saqlashda muammo yuz berdi.');
      setSaving(false);
      return;
    }
    router.replace('/dashboard');
    router.refresh();
  }

  if (loading) return <main className="state-page"><div className="loading-card"><span className="loading-dot" /> Boshlang‘ich sozlamalar…</div></main>;

  return (
    <main className="onboarding-page">
      <div className="onboarding-card">
        <div className="brand"><span className="brand-mark">M</span> MilliyTest</div>
        <div className="onboarding-progress"><span /></div>
        <div className="kicker">BIRINCHI SOZLASH</div>
        <h1>Sizga mos tayyorgarlikni sozlaymiz.</h1>
        <p>Faqat kerakli ma’lumotlarni kiriting. Keyin Dashboard sizga bugungi vazifani ko‘rsatadi.</p>
        <form className="form-card" onSubmit={submit}>
          <label>Ism<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" required /></label>
          <fieldset><legend>Fanlar</legend><div className="onboarding-subjects">{subjects.map((subject) => <label key={subject.id} className={`onboarding-subject ${selected.includes(subject.id) ? 'selected' : ''}`}><input type="checkbox" checked={selected.includes(subject.id)} onChange={(e) => setSelected((value) => e.target.checked ? [...value, subject.id] : value.filter((id) => id !== subject.id))} /><span>{subject.icon}</span><strong>{subject.name}</strong></label>)}</div></fieldset>
          <label>Imtihon sanasi<input type="date" value={examDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setExamDate(e.target.value)} /></label>
          <label>Maqsad daraja<select value={target} onChange={(e) => setTarget(e.target.value)}>{grades.map((grade) => <option key={grade.label}>{grade.label}</option>)}</select></label>
          <label>Kunlik vaqt<select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}><option value="30">30 daqiqa</option><option value="60">1 soat</option><option value="90">1.5 soat</option><option value="120">2 soat</option><option value="180">3 soat</option></select></label>
          {error && <div className="error-box" role="alert">{error}</div>}
          <button className="primary" disabled={saving}>{saving ? 'Saqlanmoqda…' : 'Tayyorgarlikni boshlash →'}</button>
        </form>
      </div>
    </main>
  );
}
