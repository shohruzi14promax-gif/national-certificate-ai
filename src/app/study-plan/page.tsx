'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

const grades = [
  { label: 'C', score: 50 },
  { label: 'C+', score: 55 },
  { label: 'B', score: 60 },
  { label: 'B+', score: 65 },
  { label: 'A', score: 70 },
  { label: 'A+', score: 80 },
];

type PlanItem = { plan_date: string; minutes: number; activity_type: string; title: string; subjects?: { name: string } | null };

export default function StudyPlan() {
  const supabase = useMemo(() => createClient(), []);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [target, setTarget] = useState('B+');
  const [level, setLevel] = useState('Boshlang‘ich');
  const [minutes, setMinutes] = useState(60);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [planMeta, setPlanMeta] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error: loadError } = await supabase.from('subjects').select('id,name,icon').order('sort_order');
      if (!alive) return;
      if (loadError) setError('Fanlarni yuklashda muammo yuz berdi.');
      const list = data ?? [];
      setSubjects(list);
      setSelected(list.map((item: any) => item.id));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [supabase]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!selected.length || !date) return;
    setGenerating(true);
    setError('');
    const grade = grades.find((item) => item.label === target) || grades[3];
    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ examDate: date, targetScore: grade.score, dailyMinutes: minutes, currentLevel: level, selectedSubjects: selected }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Reja yaratilmadi.');
      setPlanMeta(result);
      setItems(result.items || []);
    } catch (e: any) {
      setError(e?.message || 'Reja yaratishda muammo yuz berdi.');
    } finally {
      setGenerating(false);
    }
  }

  const grouped = items.reduce<Record<string, PlanItem[]>>((acc, item) => { (acc[item.plan_date] ||= []).push(item); return acc; }, {});
  const shownDates = Object.keys(grouped).slice(0, 14);

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/practice">Practice</Link><Link href="/analytics">Analytics</Link></nav></header>
        <section className="plan-wrap">
          <div className="kicker">STUDY PLAN</div><h1>Imtihongacha yo‘l xaritasi.</h1><p className="lead">Imtihon sanasi, maqsad daraja va zaif mavzular asosida real kunlik reja tuzing.</p>
          {loading && <div className="loading-card"><span className="loading-dot" /> Ma’lumotlar yuklanmoqda…</div>}
          {!loading && <form onSubmit={submit} className="form-card plan-builder">
            <label>Imtihon sanasi<input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={e => setDate(e.target.value)} required /></label>
            <label>Maqsad daraja<select value={target} onChange={e => setTarget(e.target.value)}>{grades.map((grade) => <option key={grade.label}>{grade.label}</option>)}</select></label>
            <label>Hozirgi daraja<select value={level} onChange={e => setLevel(e.target.value)}><option>Boshlang‘ich</option><option>O‘rta</option><option>Yaxshi</option><option>Yuqori</option></select></label>
            <label>Kunlik vaqt<select value={minutes} onChange={e => setMinutes(Number(e.target.value))}><option value="30">30 daqiqa</option><option value="60">1 soat</option><option value="90">1.5 soat</option><option value="120">2 soat</option><option value="180">3 soat</option></select></label>
            <fieldset><legend>Fanlar</legend><div className="subject-checks">{subjects.map((subject) => <label key={subject.id} className="check-row"><input type="checkbox" checked={selected.includes(subject.id)} onChange={e => setSelected(value => e.target.checked ? [...value, subject.id] : value.filter(id => id !== subject.id))}/><span>{subject.icon}</span>{subject.name}</label>)}</div></fieldset>
            {error && <div className="error-box" role="alert">{error}</div>}
            <button className="primary" disabled={generating || !date || !selected.length}>{generating ? 'Reja tuzilmoqda…' : 'Rejani yaratish →'}</button>
          </form>}

          {planMeta && <section className="generated plan-result"><div className="plan-result-head"><div><div className="kicker">REJA TAYYOR</div><h2>{planMeta.horizon} kunlik boshlang‘ich reja</h2><p>Keyingi natijalar zaif mavzular ustuvorligini o‘zgartirishi mumkin.</p></div><Link className="secondary" href="/dashboard">Dashboard →</Link></div><div className="plan-calendar">{shownDates.map((day) => <article className="plan-day" key={day}><div className="plan-day-date">{new Date(`${day}T12:00:00`).toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}</div>{grouped[day].map((item) => <div className="plan-item" key={`${day}-${item.title}`}><span className="plan-item-dot" /><div><strong>{item.title}</strong><small>{item.subjects?.name || 'Fan'} · {item.minutes} daqiqa · {item.activity_type === 'mock' ? 'Mock' : item.activity_type === 'review' ? 'Takrorlash' : 'Practice'}</small></div></div>)}</article>)}</div></section>}
        </section>
      </div>
    </main>
  );
}
