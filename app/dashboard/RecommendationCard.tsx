'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {createClient} from '@/lib/supabase';

type Props={topicId:string;topicName:string;subjectName:string;accuracy:number;attempted:number};
export default function RecommendationCard({topicId,topicName,subjectName,accuracy,attempted}:Props){
 const supabase=useMemo(()=>createClient(),[]); const [done,setDone]=useState(false); const priority=accuracy<50?'high':accuracy<70?'medium':'low';
 async function complete(){const {data:{user}}=await supabase.auth.getUser();if(!user)return;const {error}=await supabase.from('recommendations').insert({user_id:user.id,topic_id:topicId,kind:'weak_topic',title:`${topicName} bo‘yicha practice`,reason:`Aniqlik ${Math.round(accuracy)}%. ${attempted} ta urinish asosida bu mavzuni mustahkamlash tavsiya qilinadi.`,priority,completed:true});if(!error)setDone(true)}
 if(done)return <div className="recommendation-done">✓ Tavsiya bajarildi: {topicName}</div>;
 return <article className="recommendation-card"><div><div className="kicker">BUGUNGI TAVSIYA · {priority.toUpperCase()}</div><h3>{topicName}</h3><p>{subjectName} · {Math.round(accuracy)}% aniqlik · {attempted} urinish</p><small>Avval shu mavzudan practice qilib, xatolarni tahlil qiling.</small></div><div className="recommendation-actions"><Link className="primary" href={`/practice?topic=${encodeURIComponent(topicName)}`}>Practice →</Link><button className="secondary" onClick={complete}>Bajarildi</button></div></article>
}
