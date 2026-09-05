'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

type Option = { id: string; option_text: string; option_key: string };
type Question = { id: string; text: string; difficulty: string; topic_id: string | null; explanation: string | null; options: Option[] };
type Mock = { id: string; title: string; duration_minutes: number | null; question_count: number; subject_id: string | null; subject?: { name: string; slug: string; icon?: string } | null; test_questions: { position: number; question_id: string }[] };
type Result = { correct: boolean; selected: string; time: number };

const grade = (score: number) => score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : score >= 55 ? 'C+' : 'C';
const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.max(0, seconds % 60).toString().padStart(2, '0')}`;

export default function MockExamPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [mocks, setMocks] = useState<Mock[]>([]);
  const [selectedMock, setSelectedMock] = useState<Mock | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);
  const [attemptId, setAttemptId] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error: loadError } = await supabase.from('tests').select('id,title,duration_minutes,question_count,subject_id,subject:subjects(name,slug,icon),test_questions(position,question_id)').eq('mode', 'mock').order('created_at', { ascending: false });
      if (loadError) setError(loadError.message);
      setMocks((data ?? []) as unknown as Mock[]);
      setLoading(false);
    })();
  }, [supabase]);

  useEffect(() => {
    if (!started || done) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) { window.clearInterval(timer); void finish(); return 0; }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, done]);

  const start = async (mock: Mock) => {
    setError('');
    const ids = [...(mock.test_questions ?? [])].sort((a, b) => a.position - b.position).map((x) => x.question_id);
    if (!ids.length) { setError('Bu mock uchun savollar hali biriktirilmagan.'); return; }
    const { data: qs, error: qe } = await supabase.from('questions').select('id,text,difficulty,topic_id,explanation,question_options(id,option_text,option_key)').in('id', ids).eq('status', 'published');
    if (qe || !qs?.length) { setError(qe?.message || 'Mock savollari topilmadi.'); return; }
    const ordered = ids.map((id) => (qs as any[]).find((q) => q.id === id)).filter(Boolean).map((q: any) => ({ ...q, options: (q.question_options ?? []).sort((a: Option, b: Option) => a.option_key.localeCompare(b.option_key)) }));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { data: attempt, error: ae } = await supabase.from('test_attempts').insert({ user_id: user.id, test_id: mock.id, subject_id: mock.subject_id, total_count: ordered.length, mode: 'mock' }).select('id').single();
    if (ae) { setError(ae.message); return; }
    setSelectedMock(mock); setQuestions(ordered); setAttemptId(attempt.id); setAnswers({}); setResults({}); setFlagged({}); setIndex(0); setRemaining(Math.max(60, (mock.duration_minutes ?? 30) * 60)); setQuestionStartedAt(Date.now()); setStarted(true); setDone(false);
  };

  const saveAnswer = async (question: Question, value: string) => {
    if (!attemptId || !value) return null;
    const elapsed = Math.round((Date.now() - questionStartedAt) / 1000);
    setSaving(true);
    const { data, error: saveError } = await supabase.rpc('submit_answer', { p_attempt_id: attemptId, p_question_id: question.id, p_selected_answer: value, p_time_spent_seconds: elapsed });
    setSaving(false);
    if (saveError) { setError(saveError.message); return null; }
    const correct = Boolean(data?.[0]?.is_correct);
    const result = { correct, selected: value, time: elapsed };
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setResults((prev) => ({ ...prev, [question.id]: result }));
    return result;
  };

  const choose = async (value: string) => {
    const q = questions[index];
    if (!q || saving) return;
    await saveAnswer(q, value);
  };

  const goTo = (next: number) => { setIndex(next); setQuestionStartedAt(Date.now()); setError(''); };

  const finish = async () => {
    if (done || !attemptId) return;
    const q = questions[index];
    let finalResults = { ...results };
    if (q && answers[q.id]) {
      const r = await saveAnswer(q, answers[q.id]);
      if (r) finalResults = { ...finalResults, [q.id]: r };
    }
    const correct = Object.values(finalResults).filter((x) => x.correct).length;
    const total = questions.length;
    const score = total ? Math.round((correct / total) * 10000) / 100 : 0;
    const timeSpent = Math.max(0, (selectedMock?.duration_minutes ?? 30) * 60 - remaining);
    await supabase.from('test_attempts').update({ completed_at: new Date().toISOString(), correct_count: correct, score, time_spent_seconds: timeSpent }).eq('id', attemptId);
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (uid) await supabase.rpc('refresh_topic_progress', { p_user_id: uid });
    setResults(finalResults); setDone(true); setStarted(false);
  };

  const q = questions[index];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const correctCount = Object.values(results).filter((x) => x.correct).length;
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const topicStats = Object.values(results).length ? questions.reduce<Record<string, { total: number; correct: number }>>((acc, question) => { const r = results[question.id]; if (!r) return acc; const key = question.topic_id || 'Umumiy'; acc[key] ||= { total: 0, correct: 0 }; acc[key].total++; if (r.correct) acc[key].correct++; return acc; }, {}) : {};
  const difficultyStats = ['easy', 'medium', 'hard'].map((level) => { const qs = questions.filter((x) => x.difficulty === level); const rs = qs.map((x) => results[x.id]).filter(Boolean); return { level, total: rs.length, correct: rs.filter((r) => r.correct).length }; }).filter((x) => x.total);

  if (loading) return <main className="state-page">Yuklanmoqda…</main>;
  return <main className="dashboard-layout"><AppSidebar /><div className="dashboard-content">
    <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">N</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/practice">Practice</Link><Link href="/study-plan">Study Plan</Link></nav></header>
    <section className="practice-wrap">
      {!started && !done && <><div className="kicker">MOCK EXAM · REAL REJIM</div><h1>Imtihon simulyatsiyasi.</h1><p className="lead">Vaqt bilan ishlang, savollarni belgilang va yakunda kuchli/zaif tomonlaringizni ko‘ring.</p>{error && <div className="error-box">{error}</div>}<div className="subject-list">{mocks.map((mock) => <article className="panel" key={mock.id}><div className="panel-title"><div><h2>{mock.title}</h2><span>{mock.subject?.name || 'Aralash'} · {mock.question_count} savol</span></div><b>{mock.duration_minutes ?? '—'} min</b></div><button className="primary" onClick={() => start(mock)}>Mockni boshlash →</button></article>)}</div>{!mocks.length && <div className="panel"><p className="empty-copy">Hozircha mock testlar mavjud emas.</p></div>}</>}
      {started && q && <><div className="question-meta"><span>{selectedMock?.title}</span><strong className={remaining < 60 ? 'error-box' : ''}>⏱ {formatTime(remaining)}</strong><span>{answeredCount}/{questions.length} javob · {flaggedCount} flag</span></div><div className="panel"><div className="panel-title"><span>Savol {index + 1} / {questions.length}</span><button className="secondary" onClick={() => setFlagged((p) => ({ ...p, [q.id]: !p[q.id] }))}>{flagged[q.id] ? '★ Belgilangan' : '☆ Flag qilish'}</button></div><h1>{q.text}</h1>{q.options.map((o, i) => <button key={o.id} className={answers[q.id] === o.option_key ? 'option selected' : 'option'} onClick={() => choose(o.option_key)}><span>{String.fromCharCode(65 + i)}</span>{o.option_text}</button>)}{saving && <p className="empty-copy">Javob saqlanmoqda…</p>}{error && <div className="error-box">{error}</div>}<div className="panel-title" style={{ marginTop: 20 }}><button className="secondary" disabled={index === 0} onClick={() => goTo(index - 1)}>← Oldingi</button><button className="secondary" onClick={() => { const next = questions.findIndex((x, i) => i > index && !answers[x.id]); goTo(next >= 0 ? next : Math.min(index + 1, questions.length - 1)); }}>Keyingi →</button><button className="primary" onClick={finish}>Yakunlash</button></div></div><div className="panel"><div className="panel-title"><h2>Navigatsiya</h2><span>Javob berilmagan: {questions.length - answeredCount}</span></div><div className="options">{questions.map((x, i) => <button key={x.id} className={answers[x.id] ? 'option selected' : flagged[x.id] ? 'option' : 'option'} onClick={() => goTo(i)}>{i + 1}{flagged[x.id] ? ' ★' : ''}</button>)}</div></div></>}
      {done && <div className="result-card"><div className="kicker">MOCK NATIJA</div><h1>{score}% · {grade(score)}</h1><p>{correctCount} / {questions.length} ta to‘g‘ri. Umumiy vaqt: {formatTime(Math.max(0, (selectedMock?.duration_minutes ?? 30) * 60 - remaining))}.</p><div className="stats"><div><b>{score}%</b><span>Score</span></div><div><b>{grade(score)}</b><span>Taxminiy grade</span></div><div><b>{answeredCount}</b><span>Javob berildi</span></div><div><b>{flaggedCount}</b><span>Flag</span></div></div><section className="panel"><div className="panel-title"><h2>Qiyinlik tahlili</h2><span>Natija</span></div>{difficultyStats.map((s) => <p key={s.level}><b>{s.level}</b> — {s.correct}/{s.total} ({Math.round(s.correct / s.total * 100)}%)</p>)}</section><section className="panel"><div className="panel-title"><h2>Mavzu tahlili</h2><span>Faqat ishlangan savollar</span></div>{Object.entries(topicStats).map(([key, s]) => <p key={key}><b>{key === 'Umumiy' ? key : 'Mavzu'}</b> — {s.correct}/{s.total} ({Math.round(s.correct / s.total * 100)}%)</p>)}</section><div className="panel-title"><Link className="secondary" href="/dashboard">Dashboard →</Link><button className="primary" onClick={() => { setDone(false); setSelectedMock(null); setQuestions([]); }}>Yana mock ishlash →</button></div></div>}
    </section>
  </div></main>;
}
