-- Do not expose is_correct to students. The safe practice view is the only student-facing answer surface.
drop policy if exists options_published_select on public.question_options;
drop view if exists public.practice_questions;
create view public.practice_questions as
select q.id,q.subject_id,q.topic_id,q.subtopic_id,q.text,q.question_type,q.difficulty,q.explanation,q.source,q.source_type,q.image_url,q.tags,
coalesce(jsonb_agg(jsonb_build_object('id',o.id,'text',o.option_text,'key',o.option_key,'order',o.sort_order) order by o.sort_order) filter(where o.id is not null),'[]'::jsonb) options
from public.questions q left join public.question_options o on o.question_id=q.id
where q.status='published' group by q.id;
grant select on public.practice_questions to authenticated;
