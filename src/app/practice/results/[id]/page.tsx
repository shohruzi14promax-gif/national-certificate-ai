import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppSidebar from '@/components/AppSidebar';
import { createClient } from '@/lib/supabase/server';

type Review = {
  question_id: string;
  text: string;
  explanation: string | null;
  difficulty: string;
  topic_name: string | null;
  selected_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean;
  options: { key: string; text: string }[];
};

export default async function PracticeResult({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: attempt } = await supabase.from('test_attempts').select('id,score,correct_count,total_count,time_spent_seconds,completed_at,mode,subject_id,subjects(name)').eq('id', id).maybeSingle();
  if (!attempt) notFound();

  const { data: reviewData } = await supabase.rpc('attempt_review', { p_attempt_id: id });
  const review = (reviewData ?? []) as Review[];
  const answered = review.length;
  const unanswered = Math.max(0, Number(attempt.total_count || 0) - answered);
  const incorrect = Math.max(0, answered - Number(attempt.correct_count || 0));
  const minutes = Math.floor(Number(attempt.time_spent_seconds || 0) / 60);
  const seconds = Number(attempt.time_spent_seconds || 0) % 60;
  const score = Number(attempt.score || 0);

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/analytics">Analytics</Link><Link href="/profile">Profil</Link></nav></header>
        <section className="practice-wrap result-page">
          <div className="kicker">PRACTICE · NATIJA</div>
          <div className="result-hero">
            <div className="result-score-wrap">
              <div className="result-score" style={{ ['--score' as string]: score }} aria-label={`Natija ${score.toFixed(0)} foiz`}>
                <span className="result-score-value">{score.toFixed(0)}%</span>
              </div>
              <div><p className="result-label">Natijangiz</p><p>{(attempt.subjects as any)?.name || 'Aralash practice'} · {attempt.completed_at ? new Date(attempt.completed_at).toLocaleDateString('uz-UZ') : 'Yakunlangan'}</p></div>
            </div>
            <Link className="primary" href="/practice">Yana practice →</Link>
          </div>
          <div className="result-stats"><div><strong>{attempt.correct_count || 0}</strong><span>To‘g‘ri</span></div><div><strong>{incorrect}</strong><span>Noto‘g‘ri</span></div><div><strong>{unanswered}</strong><span>Javobsiz</span></div><div><strong>{minutes}:{String(seconds).padStart(2, '0')}</strong><span>Vaqt</span></div></div>
          <div className="result-section-head"><div><div className="kicker">REVIEW</div><h2>Javoblarni ko‘rib chiqing</h2></div><p>Xatolarni tahlil qiling va keyingi practice uchun zaif mavzularni belgilang.</p></div>
          <div className="review-list">
            {review.map((item, i) => (
              <article className={`review-card ${item.is_correct ? 'correct' : 'incorrect'}`} key={item.question_id}>
                <div className="review-card-head"><span>#{i + 1} · {item.topic_name || 'Mavzu'}</span><b>{item.is_correct ? 'To‘g‘ri' : 'Xato'}</b></div>
                <h3>{item.text}</h3>
                <div className="review-options">{item.options.map((option) => <div key={option.key} className={`${option.key === item.correct_answer ? 'correct-answer ' : ''}${option.key === item.selected_answer ? 'your-answer' : ''}`}><span>{option.key}</span>{option.text}{option.key === item.correct_answer && <small>To‘g‘ri javob</small>}{option.key === item.selected_answer && option.key !== item.correct_answer && <small>Sizning javobingiz</small>}</div>)}</div>
                <details><summary>Tushuntirish</summary><p>{item.explanation || 'Bu savol uchun tushuntirish hali qo‘shilmagan.'}</p></details>
              </article>
            ))}
            {!review.length && <div className="result-card"><h2>Ko‘rib chiqish ma’lumotlari mavjud emas.</h2><p>Natija saqlandi, ammo javob tafsilotlari hali mavjud emas.</p></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
