import {NextResponse} from 'next/server';
import {z} from 'zod';
import {requireAdmin} from '@/lib/auth';

const updateSchema=z.object({subjectId:z.string().uuid(),topicId:z.string().uuid(),text:z.string().trim().min(1),options:z.array(z.object({key:z.enum(['A','B','C','D']),text:z.string().trim().min(1)})).length(4),correctAnswer:z.enum(['A','B','C','D']),difficulty:z.enum(['easy','medium','hard']),explanation:z.string().optional(),published:z.boolean()});

export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
  try{const {id}=await params;const {supabase}=await requireAdmin();const {data,error}=await supabase.from('questions').select('id,text,status,difficulty,explanation,subject_id,topic_id,question_options(option_key,option_text,is_correct,sort_order)').eq('id',id).single();if(error)throw error;return NextResponse.json(data);}catch(e:any){return NextResponse.json({error:e?.message||'Question could not be loaded'},{status:e?.message==='FORBIDDEN'?403:404});}
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  try{const {id}=await params;const {supabase}=await requireAdmin();const body=updateSchema.parse(await req.json());const {data:subject}=await supabase.from('subjects').select('id').eq('id',body.subjectId).maybeSingle();const {data:topic}=await supabase.from('topics').select('id').eq('id',body.topicId).eq('subject_id',body.subjectId).maybeSingle();if(!subject||!topic)return NextResponse.json({error:'Subject or topic not found'},{status:400});const {error}=await supabase.from('questions').update({subject_id:body.subjectId,topic_id:body.topicId,text:body.text,difficulty:body.difficulty,status:body.published?'published':'draft',explanation:body.explanation?.trim()||null}).eq('id',id);if(error)throw error;const {error:oe}=await supabase.from('question_options').delete().eq('question_id',id);if(oe)throw oe;const {error:ie}=await supabase.from('question_options').insert(body.options.map((o,i)=>({question_id:id,option_key:o.key,option_text:o.text,sort_order:i+1,is_correct:o.key===body.correctAnswer})));if(ie)throw ie;return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e?.message||'Question could not be updated'},{status:e?.message==='FORBIDDEN'?403:e instanceof z.ZodError?400:500});}
}

export async function DELETE(_req:Request,{params}:{params:Promise<{id:string}>}){
  try{const {id}=await params;const {supabase}=await requireAdmin();const {error:oe}=await supabase.from('question_options').delete().eq('question_id',id);if(oe)throw oe;const {error}=await supabase.from('questions').delete().eq('id',id);if(error)throw error;return NextResponse.json({ok:true});}catch(e:any){return NextResponse.json({error:e?.message||'Question could not be deleted'},{status:e?.message==='FORBIDDEN'?403:409});}
}
