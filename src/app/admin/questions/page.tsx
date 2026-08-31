import Link from 'next/link';
import {requireAdmin} from '@/lib/auth';
import QuestionsManager from './QuestionsManager';

export default async function AdminQuestions(){
  const {supabase}=await requireAdmin();
  const [{data:questions,count},{data:subjects},{data:topics}]=await Promise.all([
    supabase.from('questions').select('id,text,status,difficulty,explanation,created_at,updated_at,subject_id,topic_id,subjects(name),topics(name),question_options(option_key,option_text,is_correct,sort_order)',{count:'exact'}).order('created_at',{ascending:false}).range(0,24),
    supabase.from('subjects').select('id,name').order('sort_order'),
    supabase.from('topics').select('id,name,subject_id').order('sort_order')
  ]);
  return <main className="dash-shell"><header className="dash-nav"><Link href="/admin" className="brand">← Admin</Link><span>Question Bank</span></header><section className="dash-wrap"><div className="kicker">QUESTION BANK</div><h1>Savollar.</h1><QuestionsManager initialQuestions={questions ?? []} subjects={subjects ?? []} topics={topics ?? []} total={count ?? 0}/></section></main>;
}
