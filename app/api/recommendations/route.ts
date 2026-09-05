import {NextResponse} from 'next/server';
import {createServerClient} from '@/lib/supabase-server';

export async function GET(){
  const supabase=await createServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:'UNAUTHORIZED'},{status:401});
  const [{data:existing},{data:progress},{data:attempts},{data:plan}]=await Promise.all([
    supabase.from('recommendations').select('id,subject_id,topic_id,kind,title,reason,priority,completed,created_at').eq('user_id',user.id).eq('completed',false).order('priority',{ascending:false}).order('created_at',{ascending:false}).limit(10),
    supabase.from('topic_progress').select('topic_id,accuracy,attempted,topics(name,slug,subject_id,subjects(name))').eq('user_id',user.id).order('accuracy',{ascending:true}).limit(20),
    supabase.from('test_attempts').select('subject_id,score,completed_at').eq('user_id',user.id).not('completed_at','is',null).order('completed_at',{ascending:false}).limit(20),
    supabase.from('study_plans').select('study_plan_items(completed)').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1)
  ]);
  if(existing?.length) return NextResponse.json({recommendations:existing});
  const candidates=(progress??[]).filter((x:any)=>(x.attempted??0)>=2).slice(0,5);
  const rows=candidates.map((x:any,i:number)=>({user_id:user.id,subject_id:x.topics?.subject_id??null,topic_id:x.topic_id,kind:'weak_topic',title:`${x.topics?.name??'Mavzu'} bo‘yicha practice`,reason:`Aniqlik ${Math.round(Number(x.accuracy)||0)}%. Shu mavzuni yana mashq qilish tavsiya etiladi.`,priority:100-i*10,completed:false}));
  const incomplete=(plan?.[0]?.study_plan_items??[]).filter((x:any)=>!x.completed).length;
  if(incomplete>0) rows.push({user_id:user.id,subject_id:null,topic_id:null,kind:'study_plan',title:'Study Plan vazifalarini davom ettir',reason:`Rejada ${incomplete} ta tugallanmagan vazifa bor.`,priority:80,completed:false});
  if(!rows.length && (attempts??[]).length===0) rows.push({user_id:user.id,subject_id:null,topic_id:null,kind:'first_step',title:'Birinchi practice testni boshlang',reason:'Natijalar paydo bo‘lgach, tizim sizga aniqroq tavsiyalar beradi.',priority:50,completed:false});
  if(rows.length){const {data:created,error}=await supabase.from('recommendations').insert(rows).select('id,subject_id,topic_id,kind,title,reason,priority,completed,created_at');if(error)return NextResponse.json({error:error.message},{status:400});return NextResponse.json({recommendations:created});}
  return NextResponse.json({recommendations:[]});
}

export async function PATCH(req:Request){
  const supabase=await createServerClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:'UNAUTHORIZED'},{status:401});
  const body=await req.json();
  if(!body?.id) return NextResponse.json({error:'ID required'},{status:400});
  const {data,error}=await supabase.from('recommendations').update({completed:Boolean(body.completed)}).eq('id',body.id).eq('user_id',user.id).select('id,completed').maybeSingle();
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({recommendation:data});
}
