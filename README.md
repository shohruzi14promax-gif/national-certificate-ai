# National Certificate AI

Uzbekistan-focused preparation platform for National Certificate exams. The product is designed as a complete preparation system: subject → topic → practice → results → weak-topic analysis → study plan → mock exam → progress → tutor.

> This project is independent and does not claim official affiliation with any government organization. Seed questions are non-official sample/practice content.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind-compatible CSS/design system (current MVP keeps the existing lightweight CSS system)
- Supabase Auth + PostgreSQL + Storage
- Vercel

## Current MVP

- Five database-driven subjects and topics
- Supabase email/password authentication and password recovery
- Protected dashboard, practice, mock exam, study plan, profile and tutor routes
- Published question bank with separate `question_options` and a safe student-facing `practice_questions` view
- Practice attempts, answer submission, scoring and topic progress
- Timed mock exam simulation
- Adaptive study-plan generation from exam date, target score and topic performance
- Secure AI tutor architecture with provider abstraction
- Structured AI question-generation API with Zod validation
- Server-authorized admin dashboard and question creation
- RLS policies for user-owned data

## Environment variables

Set these in `.env.local` for local development and in Vercel project settings for deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Optional AI tutor / question generation provider
AI_PROVIDER_BASE_URL=
AI_PROVIDER_API_KEY=
AI_MODEL=
```

Never put `SUPABASE_SERVICE_ROLE_KEY` or AI provider secrets in client code or `NEXT_PUBLIC_*` variables.

## Local setup

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Supabase setup

The production MVP schema was applied to the connected project on 2026-08-28.

Repository schema assets:

- `supabase/migrations/20260828_mvp.sql` — core tables, RLS, auth trigger and answer submission function
- `supabase/migrations/20260828_lock_correct_answers.sql` — prevents students from selecting `is_correct` directly and exposes only the safe practice view
- `supabase/seed.sql` — non-official sample subjects/topics/questions

The connected project contains the five seeded subjects and 15 published sample questions. Storage buckets for avatars and question images are configured in the production migration.

## Authentication

Supabase Auth handles email/password registration, login, session persistence and password recovery. A database trigger creates `profiles` and a default `student` role for new users. Admin authorization is based on `public.user_roles`, not editable user metadata.

## Question safety

Students do not receive the correct answer through the normal practice question surface. `question_options.is_correct` is restricted to admin operations; student practice uses `practice_questions`, which contains only option text/key/order. Answer checking occurs server-side through the `submit_answer` RPC.

## Seed content

All included questions are labeled as `source_type = sample` and are not presented as official exam questions. More verified/licensed content can be imported later through the admin question-bank workflow.

## Production deployment

Connect the GitHub repository to Vercel, add the environment variables above, and deploy with the standard Next.js build command. Configure Supabase Auth redirect URLs to include the deployed application origin and `/reset-password`.

## Remaining limitations

- AI Tutor and AI question generation are fully wired server-side but require an external AI provider credential before they can call a model.
- CSV/JSON bulk import UI and full admin CRUD for subjects/tests are architecture-ready but not yet a complete polished interface.
- Avatar/question-image upload UI is not yet surfaced in the MVP pages, although Storage buckets and RLS policies are present.
- A dedicated end-to-end browser test suite should be added before a large public launch.
