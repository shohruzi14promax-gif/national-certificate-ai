'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

export default function Practice() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => { supabase.from('questions').select('*').eq('status','published').limit(10).then(({data}) => setQuestions(data ?? [])); }, []);
  const q = questions[index];
  const options = Array.isArray(q?.options) ? q.options : [];
  const submit = () => { if (!selected) return; const next = index + 1; if (next >= questions.length) setScore(0); else { setIndex(next); setSelected(null); } };

  return <main className="practice-shell"><header className="dash-nav"><Link href="/" className="brand"><span className="brand-mark">N</span> National Certificate AI</Link><Link href="/dashboard">Dashboard</Link></header><section className="practice-wrap"><div className="kicker">PRACTICE</div>{score !== null ? <div className="result-card"><h1>Practice tugadi</h1><p>Natijangiz saqlandi va keyingi bosqichda progress tizimiga ulanadi.</p><Link href="/dashboard" className="primary">Dashboardga qaytish →</Link></div> : !q ? <div className="result-card"><h1>Savollar hali tayyor emas</h1><p>Admin panel orqali published savollar qo‘shilganda shu yerda avtomatik chiqadi.</p><Link href="/dashboard" className="secondary">Dashboard</Link></div> : <div className="question-card"><div className="question-meta"><span>{index + 1} / {questions.length}</span><span>{q.difficulty}</span></div><h1>{q.text}</h1><div className="options">{options.map((o:any, i:number) => { const value = typeof o === 'string' ? o : o.value ?? o.text ?? String(i); const label = typeof o === 'string' ? o : o.label ?? o.text ?? value; return <button key={value} className={selected === value ? 'option selected' : 'option'} onClick={() => setSelected(value)}><span>{String.fromCharCode(65+i)}</span>{label}</button>})}</div><button className="primary submit" onClick={submit} disabled={!selected}>Javobni tekshirish →</button></div>}</section></main>;
}
