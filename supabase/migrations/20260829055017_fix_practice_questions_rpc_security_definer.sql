create or replace function public.practice_questions(
  p_subject_id uuid default null,
  p_topic_id uuid default null,
  p_difficulty text default null,
  p_limit integer default 20
)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select private.practice_questions(p_subject_id, p_topic_id, p_difficulty, p_limit);
$$;

revoke execute on function public.practice_questions(uuid, uuid, text, integer) from anon;
grant execute on function public.practice_questions(uuid, uuid, text, integer) to authenticated;
