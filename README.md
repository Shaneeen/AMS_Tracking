# AMS Tracking

Basic internal ATS and client tracking MVP for Antares Management Services.

## Stack

- Next.js App Router
- TypeScript
- Supabase PostgreSQL, Auth, Storage
- Tailwind CSS
- shadcn-style UI primitives
- TanStack Table
- React Hook Form and Zod dependencies included for form validation growth

## Setup

1. Install Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. In Supabase SQL Editor, run:

```text
supabase/schema.sql
supabase/seed.sql
```

5. Create at least one Supabase Auth user for internal access.
6. Start the app:

```bash
npm run dev
```

## Routes

- `/login`
- `/dashboard`
- `/applicants`
- `/applicants/[id]`
- `/clients`
- `/clients/[id]`
- `/jobs`
- `/jobs/[id]`
- `/jobs/[id]/tracker`
- `/apply/[publicSlug]`

## Storage Note

The MVP creates a `resumes` bucket and allows public application form uploads under `public/`. This keeps the public form simple with the anon key. For production, move resume access to signed URLs or a server-side upload flow before handling sensitive candidate documents at scale.

## Project Notes

- Architecture details are in `docs/architecture.md`.
- SQL schema, RLS policies, storage bucket setup, and seed records are in `supabase/`.
- Internal routes require Supabase Auth via `requireUser()`.
- Public application forms only expose open job details by `public_slug`.
