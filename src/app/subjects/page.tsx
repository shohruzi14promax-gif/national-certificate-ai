import Link from 'next/link';
import AppSidebar from '@/components/AppSidebar';
import { createClient } from '@/lib/supabase/server';

type Params = { subject?: string; difficulty?: string; topic?: string };

type BankQuestion = {
  id: string;
  text: string;
  difficulty: string;
  explanation: string | null;
  topic_id: string | null;
  options: { id: string; text: string; key: string; order: number }[];
};

export default async function QuestionBank({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const supabase = await createClient();
  const [{ data: subjects }, { data: allTopics }] = await Promise.all([
    supabase.from('subjects').select('id,name,slug,icon').order('sort_order'),
    supabase.from('topics').select('id,name,slug,subject_id').order('sort_order'),
  ]);
  const subject = (subjects ?? []).find((s: any) => s.slug === p.subject);
  const topics = subject ? (allTopics ?? []).filter((t: any) => t.subject_id === subject.id) : (allTopics ?? []);
  const topic = topics.find((t: any) => t.slug === p.topic && (!subject || t.subject_id === subject.id));

  const { data: rawQuestions, error } = await supabase.rpc('practice_questions', {
    p_subject_id: subject?.id ?? null,
    p_topic_id: topic?.id ?? null,
    p_difficulty: p.difficulty || null,
    p_limit: 50,
  });
  const questions = (rawQuestions ?? []) as BankQuestion[];

  return (
    <main className="dashboard-layout">
      <AppSidebar />
      <div className="dashboard-content">
        <header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">M</span> MilliyTest</div><nav><Link href="/dashboard">Home</Link><Link href="/practice">Practice</Link><Link href="/analytics">Analytics</Link></nav></header>
        <section className="subject-wrap">
          <div className="section-heading"><div><div className="kicker">QUESTION BANK</div><h1>Savollar bazasi</h1><p>Kerakli fan, mavzu va qiyinlikni tanlab maqsadli savollarni ishlang.</p></div><Link className="primary" href="/practice">Practice →</Link></div>
          <form className="form-card qb-filters" method="get">
            <label>Fan<select name="subject" defaultValue={p.subject || ''}><option value="">Barcha fanlar</option>{(subjects ?? []).map((s: any) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></label>
            <label>Mavzu<select name="topic" defaultValue={p.topic || ''}><option value="">Barcha mavzular</option>{topics.map((t: any) => <option key={t.slug} value={t.slug}>{t.name}</option>)}</select></label>
            <label>Qiyinlik<select name="difficulty" defaultValue={p.difficulty || ''}><option value="">Barchasi</option><option value="easy">Oson</option><option value="medium">O‘rta</option><option value="hard">Qiyin</option></select></label>
            <button className="primary" type="submit">Filtrlash →</button>
          </form>
          {error && <div className="error-box" role="alert">Savollarni yuklashda muammo yuz berdi. Qayta urinib ko‘ring.</div>}
          <div className="bank-toolbar"><span>{questions.length} ta savol ko‘rsatildi</span>{subject && <Link href="/subjects">Filtrlarni tozalash</Link>}</div>
          <div className="question-bank-list">
            {questions.map((q, i) => (
              <article className="panel bank-question" key={q.id}>
                <div className="question-meta"><span>{i + 1}. {(topics.find((t: any) => t.id === q.topic_id) as any)?.name || 'Mavzu'}</span><span className={`difficulty ${q.difficulty}`}>{q.difficulty === 'easy' ? 'OSON' : q.difficulty === 'medium' ? 'O‘RTA' : 'QIYIN'}</span></div>
                <h2>{q.text}</h2>
                <div className="bank-options">{(q.options ?? []).sort((a, b) => a.order - b.order).map((o) => <div key={o.id}><b>{o.key}</b>{o.text}</div>)}</div>
                <details><summary>Tushuntirish</summary><p>{q.explanation || 'Tushuntirish hali qo‘shilmagan.'}</p></details>
              </article>
            ))}
            {!questions.length && <div className="result-card"><div className="empty-icon">⌁</div><h2>Bu filtrlar bo‘yicha savol topilmadi.</h2><p>Fan yoki qiyinlikni o‘zgartirib ko‘ring. Yangi tasdiqlangan savollar qo‘shilgani sari baza kengayadi.</p><Link className="secondary" href="/subjects">Filtrlarni tozalash</Link></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
