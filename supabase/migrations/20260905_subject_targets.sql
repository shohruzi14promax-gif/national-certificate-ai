alter table public.user_subjects add column if not exists target_grade text not null default 'B+' check(target_grade in ('C','C+','B','B+','A','A+'));
