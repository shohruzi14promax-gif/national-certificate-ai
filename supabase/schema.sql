create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  username text unique,
  avatar_url text,
  preferred_language text not null default 'uz',
  target_score integer,
  exam_date date,
  current_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  unique(subject_id, slug)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  text text not null,
  question_type text not null default 'multiple_choice',
  difficulty text not null default 'medium',
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  source text,
  image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists public.tests (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  mode text not null default 'practice',
  duration_minutes integer,
  question_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.test_questions (
  test_id uuid not null references public.tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position integer not null,
  primary key(test_id, question_id),
  unique(test_id, position)
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_id uuid references public.tests(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric(6,2),
  correct_count integer not null default 0,
  total_count integer not null default 0,
  time_spent_seconds integer not null default 0
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer text,
  is_correct boolean not null default false,
  time_spent_seconds integer not null default 0,
  answered_at timestamptz not null default now(),
  unique(attempt_id, question_id)
);

create table if not exists public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  attempted integer not null default 0,
  correct integer not null default 0,
  accuracy numeric(6,2) not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, topic_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  started_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  completed boolean not null default false
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  kind text not null,
  title text not null,
  reason text,
  priority integer not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists questions_subject_topic_idx on public.questions(subject_id, topic_id);
create index if not exists attempts_user_idx on public.test_attempts(user_id, started_at desc);
create index if not exists answers_attempt_idx on public.answers(attempt_id);
create index if not exists progress_user_idx on public.topic_progress(user_id);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.answers enable row level security;
alter table public.topic_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.recommendations enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy "public read subjects" on public.subjects for select using (true);
create policy "public read topics" on public.topics for select using (true);
create policy "public read published questions" on public.questions for select using (status = 'published');
create policy "public read tests" on public.tests for select using (true);
create policy "public read test questions" on public.test_questions for select using (true);

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own attempts" on public.test_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own answers" on public.answers for all using (exists (select 1 from public.test_attempts a where a.id = attempt_id and a.user_id = auth.uid())) with check (exists (select 1 from public.test_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "own progress" on public.topic_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own sessions" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own recommendations" on public.recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own conversations" on public.ai_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own messages" on public.ai_messages for all using (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid())) with check (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()));

insert into public.subjects (name, slug, description, icon, sort_order) values
('Matematika','matematika','Milliy sertifikat uchun matematika tayyorgarligi','∑',1),
('Tarix','tarix','O‘zbekiston va jahon tarixi','⌘',2),
('Kimyo','kimyo','Kimyo nazariyasi va masalalar','⚗',3),
('Biologiya','biologiya','Biologiya mavzulari va testlar','⌬',4),
('Ona tili va adabiyot','ona-tili-adabiyot','Ona tili va adabiyot','Aa',5)
on conflict (slug) do nothing;
