import {NextResponse} from 'next/server';
import {z} from 'zod';
import {requireAdmin} from '@/lib/auth';

const option=z.object({key:z.enum(['A','B','C','D']),text:z.string().min(1).max(2000)});
const payload=z.object({
  subjectId:z.string().uuid(),
  topicId:z.string().uuid().nullable(),
  text:z.string().min(1).max(10000),
  explanation:z.string().max(10000).nullable().optional(),
  difficulty:z.enum(['easy','medium','hard']),
  status:z.enum(['draft','published','archived']),
  sourceType:z.enum(['sample','practice','ai_generated','verified']),
  source:z.string().max(2000).nullable().optional(),
  options:z.array(option).length(4),
  correctAnswer:z.enum(['A','B','C','D'])
});

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {supabase}=await requireAdmin();
    const {id}=await params;
    const body=payload.parse(await req.json());
    if(!body.options.some(o=>o.key===body.correctAnswer)) return NextResponse.json({error:'To‘g‘ri javob variantlardan biri bo‘lishi kerak.'},{status:400});
    const {error}=await supabase.from('questions').update({subject_id:body.subjectId,topic_id:body.topicId,text:body.text,explanation:body.explanation??null,difficulty:body.difficulty,status:body.status,source_type:body.sourceType,source:body.source??null,updated_at:new Date().toISOString()}).eq('id',id);
    if(error)throw error;
    const {error:de}=await supabase.from('question_options').delete().eq('question_id',id);
    if(de)throw de;
    const {error:oe}=await supabase.from('question_options').insert(body.options.map((o,i)=>({question_id:id,option_text:o.text,option_key:o.key,sort_order:i+1,is_correct:o.key===body.correctAnswer})));
    if(oe)throw oe;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e?.message||'Question update failed'},{status:e?.message==='FORBIDDEN'?403:e?.message==='UNAUTHORIZED'?401:400})}
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {supabase}=await requireAdmin();
    const {id}=await params;
    const {error}=await supabase.from('questions').update({status:'archived',updated_at:new Date().toISOString()}).eq('id',id);
    if(error)throw error;
    return NextResponse.json({ok:true});
  }catch(e:any){return NextResponse.json({error:e?.message||'Question archive failed'},{status:e?.message==='FORBIDDEN'?403:e?.message==='UNAUTHORIZED'?401:400})}
}
