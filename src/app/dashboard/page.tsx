'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase';
import AppSidebar from '@/components/AppSidebar';

const TARGETS=['C','C+','B','B+','A','A+'];

function daysLeft(date?:string|null){
  if(!date)return null;
  const end=new Date(`${date}T23:59:59`);
  return Math.max(0,Math.ceil((end.getTime()-Date.now())/86400000));
}

export default function Dashboard(){
  const supabase=createClient();const router=useRouter();
  const [user,setUser]=useState<any>(null),[profile,setProfile]=useState<any>(null),[subjects,setSubjects]=useState<any[]>([]),[stats,setStats]=useState({attempted:0,correct:0,tests:0,accuracy:0,streak:0}),[weak,setWeak]=useState<any[]>([]),[recent,setRecent]=useState<any[]>([]),[targets,setTargets]=useState<Record<string,string>>({}),[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace('/login');return;}setUser(user);
    const [{data:p},{data:s},{data:a},{data:progress}]=await Promise.all([
      supabase.from('profiles').select('*').eq('id',user.id).maybeSingle(),
      supabase.from('subjects').select('*').order('sort_order'),
      supabase.from('test_attempts').select('id,correct_count,total_count,score,started_at,completed_at,mode,subject_id').eq('user_id',user.id).order('started_at',{ascending:false}),
      supabase.from('topic_progress').select('topic_id,accuracy,attempted,correct,topics(name,slug,subject_id,subjects(name))').eq('user_id',user.id).order('accuracy',{ascending:true}).limit(8)
    ]);
    setProfile(p);const attempts=a??[];const total=attempts.reduce((n,x)=>n+(x.total_count||0),0);const correct=attempts.reduce((n,x)=>n+(x.correct_count||0),0);const days=new Set(attempts.filter((x:any)=>x.completed_at).map((x:any)=>new Date(x.completed_at).toISOString().slice(0,10)));let streak=0;const cursor=new Date();while(days.has(cursor.toISOString().slice(0,10))){streak++;cursor.setDate(cursor.getDate()-1);}setStats({attempted:total,correct,tests:attempts.length,accuracy:total?Math.round(correct/total*100):0,streak});setRecent(attempts.slice(0,5));setWeak((progress??[]).filter((x:any)=>(x.attempted||0)>0).slice(0,4));setSubjects(s??[]);
    const saved=typeof window!=='undefined'?localStorage.getItem('nc-targets'):null;if(saved)try{setTargets(JSON.parse(saved))}catch{}
    setLoading(false);
  })()},[router,supabase]);
  if(loading)return <main className="state-page">Yuklanmoqda…</main>;
  const hasActivity=stats.attempted>0;const examDate=profile?.exam_date;const totalDays=daysLeft(examDate);
  function setTarget(id:string,value:string){const next={...targets,[id]:value};setTargets(next);localStorage.setItem('nc-targets',JSON.stringify(next));}
  return <main className="dashboard-layout"><AppSidebar/><div className="dashboard-content"><header className="dashboard-topbar"><div className="dashboard-mobile-brand"><span className="brand-mark">N</span> National Certificate AI</div><nav><Link href="/tutor">Tutor</Link><Link href="/study-plan">Study Plan</Link><Link href="/profile">Profil</Link></nav></header>
    <section className="dash-wrap">
      <div className="dash-head"><div><div className="kicker">STUDENT DASHBOARD</div><h1>Salom, {profile?.name||user?.email?.split('@')[0]||'Student'}!</h1><p>{hasActivity?'Bugungi tayyorgarlikni natijalaringizdan kelib chiqib davom ettiring.':'Hozircha natijalar yo‘q. Birinchi practice testni boshlang.'}</p></div><Link className="primary" href="/practice">Practice boshlash →</Link></div>
      <div className="stats"><div><b>{stats.accuracy}%</b><span>Aniqlik</span></div><div><b>{stats.attempted}</b><span>Savol yechildi</span></div><div><b>{stats.correct}</b><span>To‘g‘ri javob</span></div><div><b>{stats.streak}</b><span>Kunlik streak</span></div></div>
      <section className="panel exam-panel"><div className="panel-title"><div><div className="kicker">EXAM PREP</div><h2>Imtihon maqsadlaringiz</h2></div><Link href="/profile" className="secondary">Sanani sozlash →</Link></div><p className="exam-intro">Har bir fan uchun maqsad darajani belgilang. Countdown imtihon sanangizga qarab yangilanadi.</p><div className="exam-subject-grid">{subjects.map((s:any)=><article className="exam-subject" key={s.id}><div className="exam-subject-top"><span className="subject-icon">{s.icon}</span><div><b>{s.name}</b><small>{examDate?`${totalDays} kun qoldi`:'Imtihon sanasi kiritilmagan'}</small></div></div><div className="countdown-row"><strong>{totalDays===null?'—':totalDays}</strong><span>kun</span><span className="countdown-label">COUNTDOWN</span></div><label className="target-label">Target score<select value={targets[s.id]||'B+'} onChange={e=>setTarget(s.id,e.target.value)}>{TARGETS.map(t=><option key={t}>{t}</option>)}</select></label><Link href={`/practice?subject=${s.slug}`} className="exam-practice">Practice →</Link></article>)}</div></section>
      <div className="dash-grid"><section className="panel"><div className="panel-title"><h2>Fanlar</h2><span>{subjects.length} ta fan</span></div><div className="subject-list">{subjects.map((s:any)=><Link href={`/subjects/${s.slug}`} className="dash-subject" key={s.slug}><span className="subject-icon">{s.icon}</span><div><b>{s.name}</b><small>Fan va mavzularni ko‘rish</small></div><span>→</span></Link>)}</div></section><aside className="panel plan"><div className="kicker">KEYINGI QADAM</div><h2>{profile?.exam_date?'Rejangizni davom ettiring.':'Imtihongacha reja tuzing.'}</h2><p>Study Plan tanlangan fanlar va real zaif mavzularni hisobga oladi.</p><Link href="/study-plan" className="secondary">Study Plan →</Link></aside></div>
      {hasActivity&&<div className="dash-grid"><section className="panel"><div className="panel-title"><h2>Zaif mavzular</h2><span>Real natijalar</span></div>{weak.length?<div className="weak-list">{weak.map((x:any)=><Link key={x.topic_id} href={`/practice?topic=${x.topics?.slug||''}`} className="dash-subject"><div><b>{x.topics?.name||'Mavzu'}</b><small>{x.topics?.subjects?.name||''} · {Number(x.accuracy).toFixed(0)}% aniqlik</small></div><span>→</span></Link>)}</div>:<p className="empty-copy">Yetarli ma’lumot yig‘ilgach zaif mavzular shu yerda chiqadi.</p>}</section><section className="panel"><div className="panel-title"><h2>So‘nggi faoliyat</h2><span>{recent.length} ta</span></div>{recent.length?<div className="recent-list">{recent.map((a:any)=><div className="recent-row" key={a.id}><span>{a.mode==='mock'?'Mock':'Practice'}</span><b>{a.score??0}%</b><small>{new Date(a.started_at).toLocaleDateString('uz-UZ')}</small></div>)}</div>:<p className="empty-copy">Hali testlar bajarilmagan.</p>}</section></div>}
    </section></div></main>;
}
