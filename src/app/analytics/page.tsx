import Link from 'next/link';
import AppSidebar from '@/components/AppSidebar';
import { createClient } from '@/lib/supabase/server';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: attempts }, { data: progress }] = await Promise.all([
    supabase.from('test_attempts').select('id,score,correct_count,total_count,time_spent_seconds,started_at,completed_at,mode,subjects(name)').eq('user_id', user.id).order('started_at', { ascending: false }).limit(30),
    supabase.from('topic_progress').select('topic_id,accuracy,attempted,correct,topics(name,slug,subjects(name,slug))').eq('user_id', user.id).order('accuracy', { ascending: true }).limit(30),
  ]);

  const list = attempts ?? [];
  const totalQuestions = list.reduce((sum: number, item: any) => sum + Number(item.total_count || 0), 0);
  const totalCorrect = list.reduce((sum: number, item: any) => sum + Number(item.correct_count || 0), 0);
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const averageTime = list.length ? Math.round(list.reduce((sum: number, item: any) => sum + Number(item.time_spent_seconds || 0), 0) / list.length) : 0;
  const minutes = Math.floor(averageTime / 60);
  const weak = (progress ?? []).filter((item: any) => Number(item.attempted || 0) > 0).slice(0, 6);
  const strong = [...(progress ?? [])].filter((item: any) => Number(item.attempted || 0) > 0).sort((a: any, b: any) => Number(b.accuracy) - Number(a.accuracy)).slice(0, 4);

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/practice">Practice</Link><Link href="/profile">Profil</Link></nav></header>
        <section className="dash-wrap analytics-page">
          <div className="dash-head"><div><div className="kicker">PERFORMANCE ANALYTICS</div><h1>Natijalaringizni tushuning.</h1><p>Qaysi mavzularda kuchli ekaningizni, qayerda ko‘proq ishlash kerakligini va progressni shu yerdan kuzating.</p></div><Link className="primary" href="/practice">Mashqni davom ettirish →</Link></div>
          <div className="stats analytics-stats"><div><b>{accuracy}%</b><span>Umumiy aniqlik</span></div><div><b>{totalQuestions}</b><span>Yechilgan savol</span></div><div><b>{list.length}</b><span>Practice urinish</span></div><div><b>{minutes} daq.</b><span>O‘rtacha vaqt</span></div></div>
          <div className="analytics-grid">
            <section className="panel"><div className="panel-title"><div><div className="kicker">FOCUS</div><h2>Avval shu mavzular</h2></div></div><p className="analytics-copy">Aniqligi past yoki hali kam ishlangan mavzular keyingi mashg‘ulot uchun ustuvor.</p><div className="topic-performance">{weak.map((item: any) => <Link key={item.topic_id} href={`/practice?topic=${item.topics?.slug || ''}`} className="performance-row"><div><strong>{item.topics?.name || 'Mavzu'}</strong><small>{item.topics?.subjects?.name || 'Fan'} · {item.attempted} ta savol</small></div><b>{Number(item.accuracy).toFixed(0)}%</b></Link>)}{!weak.length && <div className="empty-copy">Ko‘proq savol ishlang — zaif mavzular shu yerda paydo bo‘ladi.</div>}</div></section>
            <section className="panel"><div className="panel-title"><div><div className="kicker">STRENGTHS</div><h2>Kuchli mavzular</h2></div></div><p className="analytics-copy">Yuqori aniqlikdagi mavzularni saqlab qolish uchun vaqti-vaqti bilan takrorlang.</p><div className="topic-performance">{strong.map((item: any) => <div key={item.topic_id} className="performance-row"><div><strong>{item.topics?.name || 'Mavzu'}</strong><small>{item.topics?.subjects?.name || 'Fan'}</small></div><b>{Number(item.accuracy).toFixed(0)}%</b></div>)}{!strong.length && <div className="empty-copy">Hali yetarli ma’lumot yo‘q.</div>}</div></section>
          </div>
          <section className="panel recent-analytics"><div className="panel-title"><div><div className="kicker">RECENT ACTIVITY</div><h2>So‘nggi urinishlar</h2></div><span>{list.length} ta</span></div>{list.length ? <div className="analytics-table">{list.slice(0, 10).map((item: any) => <div className="analytics-table-row" key={item.id}><span>{item.mode === 'mock' ? 'Mock test' : 'Practice'}</span><strong>{Number(item.score || 0).toFixed(0)}%</strong><small>{item.subjects?.name || 'Aralash'}</small><small>{new Date(item.started_at).toLocaleDateString('uz-UZ')}</small><Link href={`/practice/results/${item.id}`}>Ko‘rish →</Link></div>)}</div> : <div className="empty-copy">Hali practice natijalari yo‘q.</div>}</section>
        </section>
      </div>
    </main>
  );
}
