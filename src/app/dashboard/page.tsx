'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

const gradeMap: Record<number, string> = { 50: 'C', 55: 'C+', 60: 'B', 65: 'B+', 70: 'A', 80: 'A+' };

function daysLeft(date?: string | null) {
  if (!date) return null;
  const end = new Date(`${date}T23:59:59`);
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86400000));
}

export default function Dashboard() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ attempted: 0, correct: 0, tests: 0, accuracy: 0, streak: 0 });
  const [weak, setWeak] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) { router.replace('/login'); return; }
      if (!alive) return;
      setUser(currentUser);
      try {
        const [{ data: p }, { data: selectedSubjects }, { data: attempts }, { data: progress }] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
          supabase.from('user_subjects').select('subject_id,subjects(id,name,slug,icon,description)').eq('user_id', currentUser.id),
          supabase.from('test_attempts').select('id,correct_count,total_count,score,started_at,completed_at,mode,subject_id,subjects(name)').eq('user_id', currentUser.id).order('started_at', { ascending: false }),
          supabase.from('topic_progress').select('topic_id,accuracy,attempted,correct,topics(name,slug,subject_id,subjects(name))').eq('user_id', currentUser.id).order('accuracy', { ascending: true }).limit(5),
        ]);
        if (!alive) return;
        setProfile(p);
        setSubjects((selectedSubjects ?? []).map((row: any) => row.subjects).filter(Boolean));
        const list = attempts ?? [];
        const total = list.reduce((sum: number, item: any) => sum + Number(item.total_count || 0), 0);
        const correct = list.reduce((sum: number, item: any) => sum + Number(item.correct_count || 0), 0);
        const completedDays = new Set(list.filter((item: any) => item.completed_at).map((item: any) => new Date(item.completed_at).toISOString().slice(0, 10)));
        let streak = 0; const cursor = new Date();
        while (completedDays.has(cursor.toISOString().slice(0, 10))) { streak++; cursor.setDate(cursor.getDate() - 1); }
        setStats({ attempted: total, correct, tests: list.length, accuracy: total ? Math.round(correct / total * 100) : 0, streak });
        setRecent(list.slice(0, 5));
        setWeak((progress ?? []).filter((item: any) => Number(item.attempted || 0) > 0).slice(0, 4));
      } catch {
        setError('Ma’lumotlarni yuklashda muammo yuz berdi. Asosiy sahifa ishlashda davom etadi.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [router, supabase]);

  if (!user && loading) return <main className="dashboard-layout"><AppSidebar /><div className="dashboard-content"><section className="dash-wrap"><div className="loading-card"><span className="loading-dot" /> Dashboard tayyorlanmoqda…</div></section></div></main>;
  if (!user) return null;

  const examDays = daysLeft(profile?.exam_date);
  const targetGrade = gradeMap[Number(profile?.target_score)] || 'B+';
  const hasActivity = stats.attempted > 0;
  const displayName = profile?.name || user.email?.split('@')[0] || 'Student';

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/analytics">Analytics</Link><Link href="/study-plan">Study Plan</Link><Link href="/profile">Profil</Link></nav></header>
        <section className="dash-wrap">
          {error && <div className="error-box" role="alert">{error}</div>}
          <div className="dash-head"><div><div className="kicker">STUDENT DASHBOARD</div><h1>Salom, {displayName}.</h1><p>{hasActivity ? 'Bugungi tayyorgarlikni natijalaringizdan kelib chiqib davom ettiring.' : 'Birinchi practice-ni boshlang — natijalaringiz shu yerdan yig‘ila boshlaydi.'}</p></div><Link className="primary" href="/practice">Practice boshlash →</Link></div>
          <div className="stats"><div><b>{stats.accuracy}%</b><span>Aniqlik</span></div><div><b>{stats.attempted}</b><span>Savol yechildi</span></div><div><b>{stats.correct}</b><span>To‘g‘ri javob</span></div><div><b>{stats.streak}</b><span>Kunlik streak</span></div></div>

          <section className="panel exam-panel"><div className="panel-title"><div><div className="kicker">EXAM PREP</div><h2>Bugungi fokus</h2></div><Link href="/profile" className="secondary">Maqsadni sozlash →</Link></div><div className="focus-grid"><div className="focus-main"><span className="focus-label">MAQSAD</span><strong>{targetGrade}</strong><small>{profile?.exam_date ? `Imtihongacha ${examDays} kun` : 'Imtihon sanasini kiriting'}</small></div><div className="focus-action"><span className="focus-label">KEYINGI QADAM</span><h3>{weak[0]?.topics?.name ? `Zaif mavzu: ${weak[0].topics.name}` : '20 ta savol ishlang'}</h3><p>{weak[0]?.topics?.subjects?.name || 'Practice'} · Natijangiz asosida tavsiya.</p><Link href={weak[0]?.topics?.slug ? `/practice?topic=${weak[0].topics.slug}` : '/practice'} className="primary">Boshlash →</Link></div></div></section>

          <div className="dash-grid"><section className="panel"><div className="panel-title"><div><div className="kicker">FANLAR</div><h2>Sizning fanlaringiz</h2></div><Link href="/subjects">Barchasi →</Link></div><div className="subject-list">{subjects.length ? subjects.map((subject) => <Link href={`/subjects/${subject.slug}`} className="dash-subject" key={subject.id}><span className="subject-icon">{subject.icon}</span><div><b>{subject.name}</b><small>{subject.description || 'Fan va mavzularni ko‘rish'}</small></div><span>→</span></Link>) : <div className="empty-copy">Onboarding yoki Profil orqali fanlaringizni tanlang.</div>}</div></section><aside className="panel plan"><div className="kicker">STUDY PLAN</div><h2>{profile?.exam_date ? 'Rejangizni davom ettiring.' : 'Imtihongacha reja tuzing.'}</h2><p>Reja zaif mavzular va maqsad darajangizni hisobga oladi.</p><Link href="/study-plan" className="secondary">Study Plan →</Link></aside></div>

          {hasActivity && <div className="dash-grid"><section className="panel"><div className="panel-title"><div><div className="kicker">WEAK TOPICS</div><h2>Ko‘proq ishlash kerak</h2></div><Link href="/analytics">Analytics →</Link></div>{weak.length ? <div className="weak-list">{weak.map((item: any) => <Link key={item.topic_id} href={`/practice?topic=${item.topics?.slug || ''}`} className="dash-subject"><div><b>{item.topics?.name || 'Mavzu'}</b><small>{item.topics?.subjects?.name || ''} · {Number(item.accuracy).toFixed(0)}% aniqlik</small></div><span>→</span></Link>)}</div> : <p className="empty-copy">Yetarli ma’lumot yig‘ilgach zaif mavzular shu yerda chiqadi.</p>}</section><section className="panel"><div className="panel-title"><div><div className="kicker">RECENT</div><h2>So‘nggi faoliyat</h2></div><Link href="/analytics">Barchasi →</Link></div>{recent.length ? <div className="recent-list">{recent.map((attempt: any) => <Link href={`/practice/results/${attempt.id}`} className="recent-row" key={attempt.id}><span>{attempt.mode === 'mock' ? 'Mock' : 'Practice'}</span><b>{Number(attempt.score || 0).toFixed(0)}%</b><small>{attempt.subjects?.name || 'Aralash'} · {new Date(attempt.started_at).toLocaleDateString('uz-UZ')}</small></Link>)}</div> : <p className="empty-copy">Hali testlar bajarilmagan.</p>}</section></div>}
        </section>
      </div>
    </main>
  );
}
