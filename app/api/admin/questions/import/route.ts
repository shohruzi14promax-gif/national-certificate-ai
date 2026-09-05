import {NextResponse} from 'next/server';
import {z} from 'zod';
import {requireAdmin} from '@/lib/auth';

const option=z.object({key:z.enum(['A','B','C','D']),text:z.string().trim().min(1).max(2000)});
const row=z.object({
  subjectId:z.string().uuid(), topicId:z.string().uuid().nullable(), text:z.string().trim().min(1).max(10000),
  explanation:z.string().max(10000).nullable().optional(), difficulty:z.enum(['easy','medium','hard']).default('medium'),
  status:z.enum(['draft','published','archived']).default('draft'), sourceType:z.enum(['sample','practice','verified']).default('sample'),
  source:z.string().max(2000).nullable().optional(), options:z.array(option).length(4), correctAnswer:z.enum(['A','B','C','D'])
});
const payload=z.object({rows:z.array(row).min(1).max(500)});

export async function POST(req:Request){
  try{
    const {supabase}=await requireAdmin();
    const body=payload.parse(await req.json());
    const invalid=body.rows.findIndex(r=>!r.options.some(o=>o.key===r.correctAnswer));
    if(invalid>=0) return NextResponse.json({error:`${invalid+1}-qator: correctAnswer variantlarda yo‘q.`},{status:400});

    const texts=[...new Set(body.rows.map(r=>r.text.trim()))];
    const {data:existing,error:ee}=await supabase.from('questions').select('text').in('text',texts);
    if(ee) throw ee;
    const existingSet=new Set((existing??[]).map((q:any)=>q.text.trim()));
    const seen=new Set<string>();
    const rows=body.rows.filter(r=>{const key=r.text.trim();if(existingSet.has(key)||seen.has(key))return false;seen.add(key);return true;});
    if(!rows.length) return NextResponse.json({inserted:0,skipped:body.rows.length,duplicates:body.rows.length,errors:[]});

    const {data:inserted,error:ie}=await supabase.from('questions').insert(rows.map(r=>({subject_id:r.subjectId,topic_id:r.topicId,text:r.text.trim(),question_type:'multiple_choice',difficulty:r.difficulty,status:r.status,source_type:r.sourceType,source:r.source??null,explanation:r.explanation??null,tags:[]}))).select('id,text');
    if(ie) throw ie;
    const insertedIds=inserted??[];
    const byText=new Map(insertedIds.map((q:any)=>[q.text,q.id]));
    const optionRows=rows.flatMap(r=>r.options.map((o,i)=>({question_id:byText.get(r.text.trim()),option_text:o.text.trim(),option_key:o.key,sort_order:i+1,is_correct:o.key===r.correctAnswer})));
    const {error:oe}=await supabase.from('question_options').insert(optionRows);
    if(oe) throw oe;
    return NextResponse.json({inserted:rows.length,skipped:body.rows.length-rows.length,duplicates:body.rows.length-rows.length,errors:[]});
  }catch(e:any){return NextResponse.json({error:e?.message||'Import failed'},{status:e?.message==='FORBIDDEN'?403:e?.message==='UNAUTHORIZED'?401:400})}
}
