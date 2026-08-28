'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const subjects = ['Matematika','Tarix','Kimyo','Biologiya','Ona tili va adabiyot'];
export default function StudyPlan() {
  const [date,setDate]=useState(''); const [level,setLevel]=useState('Boshlang‘ich'); const [hours,setHours]=useState('1');
  const days=useMemo(()=>{ if(!date) return 0; return Math.max(0,Math.ceil((new Date(date).getTime()-Date.now())/86400000)); },[date]);
  return <main className="plan-page"><header className="dash-nav"><Link href="/" className="brand"><span className="brand-mark">N</span> National Certificate AI</Link><Link href="/dashboard">Dashboard</Link></header><section className="plan-wrap"><div className="kicker">AI STUDY PLAN</div><h1>Imtihoningizga mos reja.</h1><p className="lead">Har bir fan uchun alohida tayyorgarlik yo‘li. Avval sanani va hozirgi darajangizni kiriting.</p><div className="form-card"><label>Imtihon sanasi<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label>Hozirgi daraja<select value={level} onChange={e=>setLevel(e.target.value)}><option>Boshlang‘ich</option><option>O‘rta</option><option>Yaxshi</option><option>Yuqori</option></select></label><label>Kunlik vaqt<select value={hours} onChange={e=>setHours(e.target.value)}><option value="1">1 soat</option><option value="2">2 soat</option><option value="3">3 soat</option><option value="4">4+ soat</option></select></label><button className="primary">Rejani yaratish →</button></div>{date&&<div className="generated"><div><b>{days}</b><span>kun qoldi</span></div><div><b>{level}</b><span>boshlang‘ich daraja</span></div><div><b>{hours} soat</b><span>kunlik maqsad</span></div><div className="weekly"><h2>5 fan bo‘yicha yo‘nalish</h2>{subjects.map((s,i)=><div key={s}><span>{s}</span><small>{i===0?'Mavzular + Practice':i===1?'Nazariya + Test':'Nazariya + Masalalar'}</small></div>)}</div></div>}</section></main>;
}
