'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

type Term = { id: string; term: string; definition: string; example: string | null; subject_id: string | null; subjects?: { name: string } | null };

export default function Terminlar() {
  const supabase = useMemo(() => createClient(), []);
  const [terms, setTerms] = useState<Term[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      const [{ data: subjectData, error: subjectError }, { data: termData, error: termError }] = await Promise.all([
        supabase.from('subjects').select('id,name').order('sort_order'),
        supabase.from('terminlar').select('id,term,definition,example,subject_id,subjects(name)').order('term'),
      ]);
      if (!alive) return;
      if (subjectError || termError) setError('Terminlarni yuklashda muammo yuz berdi. Qayta urinib ko‘ring.');
      setSubjects(subjectData ?? []);
      setTerms((termData ?? []) as Term[]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [supabase]);

  const filtered = terms.filter((item) => {
    const matchesSubject = !subjectId || item.subject_id === subjectId;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q);
    return matchesSubject && matchesQuery;
  });

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/subjects">Question Bank</Link><Link href="/analytics">Analytics</Link></nav></header>
        <section className="subject-wrap glossary-page">
          <div className="section-heading"><div><div className="kicker">TERMINLAR</div><h1>Bilishingiz kerak bo‘lgan tushunchalar.</h1><p>Fan bo‘yicha terminlarni izlang, ta’rifini o‘qing va misol bilan mustahkamlang.</p></div></div>
          <div className="glossary-filters"><input aria-label="Termin qidirish" placeholder="Termin yoki ta’rifni qidiring…" value={query} onChange={(e) => setQuery(e.target.value)} /><select aria-label="Fan bo‘yicha filtrlash" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}><option value="">Barcha fanlar</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          {error && <div className="error-box" role="alert">{error}</div>}
          {loading && <div className="glossary-grid"><div className="skeleton-card" /><div className="skeleton-card" /><div className="skeleton-card" /></div>}
          {!loading && filtered.length > 0 && <div className="glossary-grid">{filtered.map((item) => <article className="term-card" key={item.id}><div className="term-meta"><span>{item.subjects?.name || 'Fan'}</span></div><h2>{item.term}</h2><p>{item.definition}</p>{item.example && <div className="term-example"><small>Misol</small><span>{item.example}</span></div>}</article>)}</div>}
          {!loading && !filtered.length && <div className="result-card"><div className="empty-icon">Aa</div><h2>{terms.length ? 'Bu qidiruv bo‘yicha termin topilmadi.' : 'Terminlar bazasi hozircha bo‘sh.'}</h2><p>{terms.length ? 'Boshqa so‘z yoki fan bilan qidirib ko‘ring.' : 'Tasdiqlangan terminlar qo‘shilgach, shu yerda ko‘rinadi.'}</p></div>}
        </section>
      </div>
    </main>
  );
}
