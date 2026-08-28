# National Certificate AI

Uzbekistan-focused preparation platform for National Certificate exams. The product is designed as a complete preparation system: subject → topic → practice → results → weak-topic analysis → study plan → mock exam → progress → tutor.

> This project is independent and does not claim official affiliation with any government organization. Seed questions are non-official sample/practice content.

## Stack

- Next.js App Router + React + TypeScript
- Existing lightweight CSS design system
- Supabase Auth + PostgreSQL + Storage
- Vercel

## Setup

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

`package-lock.json` is committed, so CI uses `npm ci` for reproducible installs. The production build requires the two Supabase public environment variables; CI supplies non-secret placeholders only to validate compilation when deployment secrets are not available.

## Environment variables

Create `.env.local` locally and configure the same variables in the Vercel project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Optional AI provider
AI_PROVIDER_BASE_URL=
AI_PROVIDER_API_KEY=
AI_MODEL=
```

Never put `SUPABASE_SERVICE_ROLE_KEY`, `AI_PROVIDER_API_KEY`, or other private credentials in client code or `NEXT_PUBLIC_*` variables.

## Supabase

Production schema/migrations are kept in `supabase/migrations/`.

Important migrations:

- `20260828_mvp.sql` — core application schema, RLS and answer RPC
- `20260828_lock_correct_answers.sql` — safe student question surface
- `20260828_production_hardening.sql` — final answer-leak/RLS hardening and sample mock seed architecture

Seed data:

- `supabase/seed.sql` — five subjects, database-driven topics and 15 non-official sample questions

The connected Supabase project has the required 19 public tables, RLS enabled on all of them, five subjects, 15 published sample questions, and sample mock tests linked to published sample questions.

## Authentication

Supabase Auth provides registration, login, logout, session persistence and password recovery. A database trigger creates a profile and default `student` role. Authorization uses `public.user_roles`, never editable profile metadata.

For Supabase Auth, configure the deployed origin plus `/reset-password` as an allowed redirect URL. For local development, also allow `http://localhost:3000/reset-password`.

## Admin setup

The first admin must be assigned server-side in Supabase. Replace the UUID with the authenticated user's real ID:

```sql
insert into public.user_roles (user_id, role)
values ('USER_UUID_HERE', 'admin')
on conflict (user_id) do update set role = 'admin';
```

Do not use `profiles` or client metadata to grant admin access.

Unauthorized `/admin` access redirects to `/login` when unauthenticated and back to `/dashboard` when authenticated without the admin role. Admin APIs return `403` for insufficient role.

## Question safety

Students never receive `question_options.is_correct` through the normal question surface. The published question policy is blocked for direct option reads; practice loads a safe representation without `is_correct`, and `submit_answer` checks the answer server-side. AI-generated content is stored with `source_type = ai_generated` and is never presented as official exam material.

## Study Plan

The Study Plan accepts exam date, target score, current level, daily study minutes and selected subjects. It uses actual `topic_progress` accuracy/attempt counts to prioritize weak or unattempted topics and increases mock/review activities near the exam date. Selected subjects are persisted to `user_subjects`.

## AI

Tutor and question generation are server-side only. When the AI variables are absent, the Tutor explicitly reports that configuration is missing. When configured, requests use the provider abstraction and generated questions are validated with Zod before they can be stored.

AI has not been declared operational without a configured provider credential.

## Vercel

The repository is Vercel-compatible as a standard Next.js App Router project. Add the environment variables, connect the GitHub repository to the intended Vercel project, and configure Supabase Auth redirect URLs. The currently connected Vercel account does not expose a `national-certificate-ai` project to the available Vercel connector, so deployment cannot be honestly marked verified from this environment.

## CI

`.github/workflows/ci.yml` runs:

```text
npm ci
npm run typecheck
npm run lint
npm run build
```

The latest verified GitHub Actions run passed all four steps: `npm ci`, TypeScript, ESLint, and the Next.js production build.

## Current limitations

- AI Tutor/question generation require an external AI provider credential for live model calls.
- CSV/JSON import has a validated admin API; a full drag-and-drop import UI is not yet surfaced.
- Avatar/question-image upload UI is not yet surfaced, although storage policies are configured.
- Full browser end-to-end authentication testing requires a real test account and configured Supabase Auth redirects.
- Vercel deployment cannot be claimed as verified until the intended Vercel project is accessible/connected.
