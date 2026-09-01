'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

type Option = { id: string; text: string; key: string };
type Q = { id: string; text: string; difficulty: string; topic_id: string | null; explanation: string | null; options: Option[] };
type Draft = { questions: Q[]; attemptId: string; index: number; answers: Record<string, string>; marked: string[]; startedAt: number; durationSeconds: number };

const MAX_QUESTIONS = 30;
const MIN_QUESTIONS = 5;

export default function PracticeClient() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get('subject') || '';
  const topicSlug = params.get('topic') || '';
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [count, setCount] = useState(10);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [attemptId, setAttemptId] = useState('');
  const [startedAt, setStartedAt] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const draftKey = `milliytest-practice:${subjectId || 'all'}:${topicId || 'all'}:${difficulty || 'all'}:${count}`;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error: subjectError } = await supabase.from('subjects').select('id,name,slug,icon').order('sort_order');
        if (subjectError) throw subjectError;
        if (!alive) return;
        const list = data ?? [];
        setSubjects(list);
        const selectedSubject = list.find((item: any) => item.slug === slug);
        if (selectedSubject) {
          setSubjectId(selectedSubject.id);
          const { data: topicData } = await supabase.from('topics').select('id,name,slug').eq('subject_id', selectedSubject.id).order('sort_order');
          if (!alive) return;
          setTopics(topicData ?? []);
          const selectedTopic = (topicData ?? []).find((item: any) => item.slug === topicSlug);
          if (selectedTopic) setTopicId(selectedTopic.id);
        } else {
          const { data: topicData } = await supabase.from('topics').select('id,name,slug').order('sort_order');
          if (alive) setTopics(topicData ?? []);
        }
      } catch {
        if (alive) setError('Fanlarni yuklashda muammo yuz berdi. Qayta urinib ko‘ring.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug, topicSlug, supabase]);

  useEffect(() => {
    if (!started || done || remaining <= 0) return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, done, remaining]);

  const persistDraft = useCallback((next: Draft) => {
    try { localStorage.setItem(draftKey, JSON.stringify(next)); } catch {}
  }, [draftKey]);

  const finishAttempt = useCallback(async () => {
    if (!attemptId || done) return;
    try {
      const { data: allAnswers } = await supabase.from('answers').select('is_correct').eq('attempt_id', attemptId);
      const correct = (allAnswers ?? []).filter((answer: any) => answer.is_correct).length;
      const elapsed = durationSeconds ? Math.min(durationSeconds, Math.max(0, Math.floor((Date.now() - startedAt) / 1000))) : 0;
      const { error: updateError } = await supabase.from('test_attempts').update({ completed_at: new Date().toISOString(), correct_count: correct, score: questions.length ? Math.round((correct / questions.length) * 10000) / 100 : 0, time_spent_seconds: elapsed }).eq('id', attemptId);
      if (updateError) throw updateError;
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) await supabase.rpc('refresh_topic_progress', { p_user_id: userData.user.id });
      try { localStorage.removeItem(draftKey); } catch {}
      setDone(true);
      router.push(`/practice/results/${attemptId}`);
    } catch {
      setError('Natijani saqlashda muammo yuz berdi. Qayta urinib ko‘ring.');
    }
  }, [attemptId, done, draftKey, durationSeconds, questions.length, router, startedAt, supabase]);

  useEffect(() => {
    if (loading || started || done) return;
    let timer: number | undefined;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      if (!draft.questions?.length || !draft.attemptId) return;
      const startedAtValue = draft.startedAt || Date.now();
      const durationValue = draft.durationSeconds || draft.questions.length * 90;
      const elapsed = Math.floor((Date.now() - startedAtValue) / 1000);
      timer = window.setTimeout(() => {
        setQuestions(draft.questions);
        setAttemptId(draft.attemptId);
        setIndex(Math.min(draft.index, draft.questions.length - 1));
        setAnswers(draft.answers || {});
        setMarked(draft.marked || []);
        setStartedAt(startedAtValue);
        setDurationSeconds(durationValue);
        setRemaining(Math.max(0, durationValue - elapsed));
        setStarted(true);
      }, 0);
    } catch {}
    return () => { if (timer !== undefined) window.clearTimeout(timer); };
  }, [draftKey, loading, started, done]);

  useEffect(() => {
    if (!started || remaining !== 0 || done) return;
    const timer = window.setTimeout(() => { void finishAttempt(); }, 0);
    return () => window.clearTimeout(timer);
  }, [remaining, started, done, finishAttempt]);

  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const start = async () => {
    setStarting(true); setError('');
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push('/login'); return; }
      const { data, error: rpcError } = await supabase.rpc('practice_questions', { p_subject_id: subjectId || null, p_topic_id: topicId || null, p_difficulty: difficulty || null, p_limit: Math.min(Math.max(count, MIN_QUESTIONS), MAX_QUESTIONS) });
      if (rpcError) throw rpcError;
      const qs = (data || []) as Q[];
      if (!qs.length) throw new Error('Tanlangan filtrlar bo‘yicha savol topilmadi.');
      const { data: attempt, error: attemptError } = await supabase.from('test_attempts').insert({ user_id: userData.user.id, subject_id: subjectId || null, total_count: qs.length, mode: 'practice' }).select('id').single();
      if (attemptError) throw attemptError;
      const totalSeconds = Math.max(600, qs.length * 90);
      const now = Date.now();
      setQuestions(qs); setAttemptId(attempt.id); setStartedAt(now); setDurationSeconds(totalSeconds); setRemaining(totalSeconds); setAnswers({}); setMarked([]); setIndex(0); setStarted(true);
      persistDraft({ questions: qs, attemptId: attempt.id, index: 0, answers: {}, marked: [], startedAt: now, durationSeconds: totalSeconds });
    } catch (e: any) {
      setError(e?.message === 'Tanlangan filtrlar bo‘yicha savol topilmadi.' ? e.message : 'Practice boshlanmadi. Ma’lumotlarni tekshirib, qayta urinib ko‘ring.');
    } finally { setStarting(false); }
  };

  const submitCurrent = async () => {
    const q = questions[index];
    const selected = answers[q?.id];
    if (!q || !selected) return;
    setError('');
    const { error: answerError } = await supabase.rpc('submit_answer', { p_attempt_id: attemptId, p_question_id: q.id, p_selected_answer: selected, p_time_spent_seconds: 0 });
    if (answerError) { setError('Javobni saqlashda muammo yuz berdi. Qayta urinib ko‘ring.'); return; }
    if (index + 1 >= questions.length) { await finishAttempt(); return; }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    persistDraft({ questions, attemptId, index: nextIndex, answers, marked, startedAt, durationSeconds });
  };

  const chooseAnswer = (key: string) => {
    const nextAnswers = { ...answers, [questions[index].id]: key };
    setAnswers(nextAnswers);
    persistDraft({ questions, attemptId, index, answers: nextAnswers, marked, startedAt, durationSeconds });
  };

  const toggleMark = () => {
    const id = questions[index]?.id;
    if (!id) return;
    const next = marked.includes(id) ? marked.filter((value) => value !== id) : [...marked, id];
    setMarked(next);
    persistDraft({ questions, attemptId, index, answers, marked: next, startedAt, durationSeconds });
  };

  const q = questions[index];
  if (loading) return <main className="state-page"><div className="loading-card"><span className="loading-dot" /> Practice tayyorlanmoqda…</div></main>;

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/analytics">Analytics</Link><Link href="/profile">Profil</Link></nav></header>
        <section className="practice-wrap">
          <div className="kicker">PRACTICE · IMTIHON REJIMI</div>
          {!started && !done && <><div className="page-intro"><div><h1>Diqqatni jamlang.</h1><p className="lead">Fan va mavzuni tanlang. Savollar natijangizni avtomatik saqlaydi.</p></div><div className="practice-note">Har bir savol uchun 90 soniya</div></div><div className="form-card practice-start-card">
            <label>Fan<select value={subjectId} onChange={async (e) => { const value = e.target.value; setSubjectId(value); setTopicId(''); const { data } = value ? await supabase.from('topics').select('id,name,slug').eq('subject_id', value).order('sort_order') : await supabase.from('topics').select('id,name,slug').order('sort_order'); setTopics(data ?? []); }}><option value="">Barcha fanlar</option>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
            <label>Mavzu<select value={topicId} onChange={(e) => setTopicId(e.target.value)}><option value="">Barcha mavzular</option>{topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
            <label>Qiyinlik<select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="">Barchasi</option><option value="easy">Oson</option><option value="medium">O‘rta</option><option value="hard">Qiyin</option></select></label>
            <label>Savollar soni<select value={count} onChange={(e) => setCount(Number(e.target.value))}><option value="5">5 ta</option><option value="10">10 ta</option><option value="20">20 ta</option><option value="30">30 ta</option></select></label>
            {error && <div className="error-box" role="alert">{error}</div>}<button className="primary" onClick={start} disabled={starting}>{starting ? 'Tayyorlanmoqda…' : 'Practice boshlash →'}</button>
          </div></>}
          {started && !done && q && <div className="exam-shell">
            <div className="exam-toolbar"><div><strong>{index + 1}</strong><span>/ {questions.length}</span></div><div className={`exam-timer${remaining < 60 ? ' danger' : ''}`} aria-live="polite">◷ {formatTime(remaining)}</div><button type="button" className={`review-toggle${marked.includes(q.id) ? ' active' : ''}`} onClick={toggleMark}>{marked.includes(q.id) ? 'Belgilangan' : 'Ko‘rib chiqish uchun belgilash'}</button></div>
            <div className="exam-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
            <div key={q.id} className="question-card exam-question"><div className="question-meta"><span>{q.difficulty === 'easy' ? 'Oson' : q.difficulty === 'hard' ? 'Qiyin' : 'O‘rta'}</span><span>{Object.keys(answers).length} ta javob saqlangan</span></div><h1>{q.text}</h1>
              <div className="options">{q.options.map((option, i) => <button key={option.id} type="button" className={answers[q.id] === option.key ? 'option selected' : 'option'} onClick={() => chooseAnswer(option.key)}><span>{String.fromCharCode(65 + i)}</span>{option.text}</button>)}</div>
              {error && <div className="error-box" role="alert">{error}</div>}
              <div className="exam-actions"><button className="secondary" type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>← Oldingi</button><button className="primary" type="button" onClick={submitCurrent} disabled={!answers[q.id]}>{index + 1 === questions.length ? 'Testni yakunlash →' : 'Keyingi savol →'}</button></div>
            </div>
            <div className="question-nav" aria-label="Savol navigatsiyasi">{questions.map((item, i) => <button key={item.id} type="button" className={`${i === index ? 'current ' : ''}${answers[item.id] ? 'answered ' : ''}${marked.includes(item.id) ? 'marked' : ''}`} onClick={() => setIndex(i)} aria-label={`${i + 1}-savol`}>{i + 1}</button>)}</div>
          </div>}
        </section>
      </div>
    </main>
  );
}
