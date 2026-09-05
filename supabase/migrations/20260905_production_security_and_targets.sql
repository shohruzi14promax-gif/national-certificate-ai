-- Production hardening: keep the student practice RPC callable without a SECURITY DEFINER wrapper,
-- and keep answer correctness server-side. Also add a canonical target grade helper.

create or replace function public.practice_questions(p_subject_id uuid default null,p_topic_id uuid default null,p_difficulty text default null,p_limit integer default 20)
returns jsonb language sql security invoker set search_path=public,pg_temp
as $$ select private.practice_questions(p_subject_id,p_topic_id,p_difficulty,p_limit); $$;
revoke all on function public.practice_questions(uuid,uuid,text,integer) from public;
grant execute on function public.practice_questions(uuid,uuid,text,integer) to authenticated;

drop function if exists public.submit_answer(uuid,uuid,text,integer);
drop function if exists private.submit_answer(uuid,uuid,text,integer);
create function private.submit_answer(p_attempt_id uuid,p_question_id uuid,p_selected_answer text,p_time_spent_seconds integer default 0)
returns table(is_correct boolean)
language plpgsql security definer set search_path=public,pg_temp
as $$
declare v_user uuid;v_correct text;v_ok boolean;
begin
  select user_id into v_user from public.test_attempts where id=p_attempt_id;
  if v_user is null or v_user<>auth.uid() then raise exception 'Not authorized'; end if;
  if not exists(select 1 from public.questions where id=p_question_id and status='published') then raise exception 'Question not available'; end if;
  select option_key into v_correct from public.question_options where question_id=p_question_id and is_correct=true limit 1;
  v_ok:=coalesce(p_selected_answer,'')=coalesce(v_correct,'');
  insert into public.answers(attempt_id,question_id,selected_answer,is_correct,time_spent_seconds)
  values(p_attempt_id,p_question_id,p_selected_answer,v_ok,greatest(0,least(coalesce(p_time_spent_seconds,0),3600)))
  on conflict(attempt_id,question_id) do update set selected_answer=excluded.selected_answer,is_correct=excluded.is_correct,time_spent_seconds=excluded.time_spent_seconds,answered_at=now();
  return query select v_ok;
end $$;
create function public.submit_answer(p_attempt_id uuid,p_question_id uuid,p_selected_answer text,p_time_spent_seconds integer default 0)
returns table(is_correct boolean)
language sql security invoker set search_path=public,pg_temp
as $$ select * from private.submit_answer(p_attempt_id,p_question_id,p_selected_answer,p_time_spent_seconds); $$;
revoke all on function public.submit_answer(uuid,uuid,text,integer) from public;
grant execute on function public.submit_answer(uuid,uuid,text,integer) to authenticated;

create or replace function public.grade_to_score(p_grade text)
returns integer language sql immutable
as $$ select case upper(trim(p_grade)) when 'C' then 50 when 'C+' then 55 when 'B' then 60 when 'B+' then 70 when 'A' then 80 when 'A+' then 90 else null end; $$;
revoke all on function public.grade_to_score(text) from public;
grant execute on function public.grade_to_score(text) to authenticated;
