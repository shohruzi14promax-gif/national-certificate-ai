import {NextResponse} from 'next/server';
import {z} from 'zod';
import {requireAdmin} from '@/lib/auth';

const optionSchema = z.object({key:z.enum(['A','B','C','D']),text:z.string().trim().min(1)});
const questionSchema = z.object({subjectId:z.string().uuid(),topicId:z.string().uuid(),text:z.string().trim().min(1),options:z.array(optionSchema).length(4),correctAnswer:z.enum(['A','B','C','D']),difficulty:z.enum(['easy','medium','hard']),explanation:z.string().optional(),published:z.boolean()});

export async function GET(req:Request){
  try{
    const {supabase}=await requireAdmin();
    const url=new URL(req.url);
    const search=url.searchParams.get('search')?.trim()||'';
    const subjectId=url.searchParams.get('subjectId')||'';
    const topicId=url.searchParams.get('topicId')||'';
    const difficulty=url.searchParams.get('difficulty')||'';
    const status=url.searchParams.get('status')||'';
    const page=Math.max(1,Number(url.searchParams.get('page')||1));
    const limit=Math.min(50,Math.max(10,Number(url.searchParams.get('limit')||25)));
    let query=supabase.from('questions').select('id,text,status,difficulty,explanation,created_at,updated_at,subject_id,topic_id,subjects(name),topics(name),question_options(option_key,option_text,is_correct,sort_order)',{count:'exact'}).order('created_at',{ascending:false}).range((page-1)*limit,page*limit-1);
    if(search)query=query.ilike('text',`%${search}%`);
    if(subjectId)query=query.eq('subject_id',subjectId);
    if(topicId)query=query.eq('topic_id',topicId);
    if(difficulty)query=query.eq('difficulty',difficulty);
    if(status)query=query.eq('status',status);
    const {data,error,count}=await query;
    if(error)throw error;
    return NextResponse.json({data:data??[],count:count??0,page,limit});
  }catch(e:any){return NextResponse.json({error:e?.message||'Questions could not be loaded'},{status:e?.message==='FORBIDDEN'?403:500});}
}

export async function POST(req:Request){
  try{
    const {supabase}=await requireAdmin();
    const body=questionSchema.parse(await req.json());
    const {data:subject}=await supabase.from('subjects').select('id').eq('id',body.subjectId).maybeSingle();
    const {data:topic}=await supabase.from('topics').select('id').eq('id',body.topicId).eq('subject_id',body.subjectId).maybeSingle();
    if(!subject)return NextResponse.json({error:'Subject not found'},{status:400});
    if(!topic)return NextResponse.json({error:'Topic not found for subject'},{status:400});
    const normalized=body.text.replace(/\s+/g,' ').trim().toLowerCase();
    const {data:existing}=await supabase.from('questions').select('id,text').limit(1000);
    if((existing??[]).some(q=>q.text.replace(/\s+/g,' ').trim().toLowerCase()===normalized))return NextResponse.json({error:'Duplicate question'},{status:409});
    const {data:q,error}=await supabase.from('questions').insert({subject_id:body.subjectId,topic_id:body.topicId,text:body.text,difficulty:body.difficulty,status:body.published?'published':'draft',explanation:body.explanation?.trim()||null,source_type:'sample',source:'Admin question bank'}).select('id').single();
    if(error)throw error;
    const {error:oe}=await supabase.from('question_options').insert(body.options.map((o,i)=>({question_id:q.id,option_key:o.key,option_text:o.text,sort_order:i+1,is_correct:o.key===body.correctAnswer})));
    if(oe){await supabase.from('questions').delete().eq('id',q.id);throw oe;}
    return NextResponse.json({ok:true,id:q.id},{status:201});
  }catch(e:any){return NextResponse.json({error:e?.message||'Question could not be created'},{status:e?.message==='FORBIDDEN'?403:e instanceof z.ZodError?400:500});}
}
