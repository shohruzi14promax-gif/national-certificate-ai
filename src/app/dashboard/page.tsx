'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const fallbackSubjects = [
  ['Matematika','∑','matematika'], ['Tarix','⌘','tarix'], ['Kimyo','⚗','kimyo'],
  ['Biologiya','⌬','biologiya'], ['Ona tili va adabiyot','Aa','ona-tili-adabiyot'],
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.from('subjects').select('*').order('sort_order').then(({ data }) => setSubjects(data ?? []));
  }, []);

  return <main className="dash-shell">
    <header className="dash-nav"><Link href="/" className="brand"><span className="brand-mark">N</span> National Certificate AI</Link><div className="dash-user">{user?.email ?? 'Student'}</div></header>
    <section className="dash-wrap">
      <div className="dash-head"><div><div className="kicker">STUDENT DASHBOARD</div><h1>Bugun nimani o‘rganamiz?</h1><p>Darajangizni oshiring va imtihonga ishonch bilan boring.</p></div><Link className="primary" href="/practice">Practice boshlash →</Link></div>
      <div className="stats"><div><b>0%</b><span>Umumiy progress</span></div><div><b>0</b><span>Savol yechildi</span></div><div><b>0%</b><span>Aniqlik</span></div><div><b>0 🔥</b><span>Streak</span></div></div>
      <div className="dash-grid"><section className="panel"><div className="panel-title"><h2>Fanlar</h2><span>5 ta fan</span></div><div className="subject-list">{(subjects.length ? subjects.map(s => [s.name,s.icon,s.slug]) : fallbackSubjects).map(([name,icon,slug]) => <Link href={`/subjects/${slug}`} className="dash-subject" key={slug}><span className="subject-icon">{icon}</span><div><b>{name}</b><small>0% progress</small></div><span>→</span></Link>)}</div></section><aside className="panel plan"><div className="kicker">AI STUDY PLAN</div><h2>Imtihon sanangizni kiriting</h2><p>AI sizning vaqtingiz va natijalaringiz asosida har bir fan uchun alohida reja tuzadi.</p><Link href="/study-plan" className="secondary">Study Plan tuzish</Link></aside></div>
    </section>
  </main>;
}
