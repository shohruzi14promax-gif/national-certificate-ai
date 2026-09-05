import Link from 'next/link';
import {requireAdmin} from '@/lib/auth';

export default async function AdminQuestions(){
  const {supabase}=await requireAdmin();
  const {data}=await supabase.from('questions').select('id,text,status,difficulty,source_type,subjects(name),topics(name)').order('created_at',{ascending:false}).limit(100);
  return <main className="dash-shell"><header className="dash-nav"><Link href="/admin" className="brand">← Admin</Link><Link href="/admin/questions/new" className="primary">Yangi savol</Link></header><section className="dash-wrap"><div className="kicker">QUESTION BANK</div><h1>Savollar.</h1><p className="lead">Savollarni ko‘ring, tahrirlang, draft/published/archived holatini boshqaring.</p><div className="admin-list">{(data??[]).map((q:any)=><article className="panel" key={q.id}><div><span className="status">{q.status}</span><h2>{q.text}</h2><p>{q.subjects?.name} · {q.topics?.name||'Mavzusiz'} · {q.difficulty} · {q.source_type}</p></div><Link className="secondary" href={`/admin/questions/edit?id=${q.id}`}>Tahrirlash →</Link></article>)}</div>{!data?.length&&<div className="result-card"><p>Hozircha savollar yo‘q.</p></div>}</section></main>
}
