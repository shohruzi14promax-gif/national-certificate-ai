-- Production hardening and seed architecture.
-- Keeps correct answers server-side and makes mock content available without claiming official status.
create schema if not exists private;

drop policy if exists options_published_select on public.question_options;
create policy options_published_select on public.question_options for select to authenticated using(false);

revoke all on function public.submit_answer(uuid,uuid,text,integer) from public;
grant execute on function public.submit_answer(uuid,uuid,text,integer) to authenticated;

drop policy if exists roles_owner_select on public.user_roles;
create policy roles_owner_select on public.user_roles for select to authenticated using(user_id=auth.uid());

create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$begin insert into public.profiles(id,name) values(new.id,coalesce(new.raw_user_meta_data->>'name','')) on conflict(id) do nothing; insert into public.user_roles(user_id,role) values(new.id,'student') on conflict(user_id) do nothing; return new; end$$;
revoke all on function private.handle_new_user() from public;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();
drop function if exists public.handle_new_user();

insert into public.tests(subject_id,title,mode,duration_minutes,question_count)
select s.id, s.name || ' — Sample Mock', 'mock', 20, count(q.id)
from public.subjects s left join public.questions q on q.subject_id=s.id and q.status='published' and q.source_type='sample'
where not exists(select 1 from public.tests t where t.subject_id=s.id and t.title=s.name || ' — Sample Mock')
group by s.id,s.name
having count(q.id)>0;

insert into public.test_questions(test_id,question_id,position)
select t.id,q.id,row_number() over(partition by t.id order by q.created_at,q.id)::integer
from public.tests t join public.questions q on q.subject_id=t.subject_id and q.status='published' and q.source_type='sample'
where t.title=(select s.name || ' — Sample Mock' from public.subjects s where s.id=t.subject_id)
  and not exists(select 1 from public.test_questions tq where tq.test_id=t.id and tq.question_id=q.id);
