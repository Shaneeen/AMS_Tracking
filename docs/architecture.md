# Antares Management Services ATS Architecture

## MVP Boundaries

The MVP replaces the current spreadsheet tracker with a simple Supabase-backed ATS and client tracking app. It includes internal authentication, basic CRUD for applicants, clients and jobs, application status tracking, resume uploads, and public job application forms.

Out of scope for the MVP: AI matching, email automation, payroll, advanced reporting, complex role permissions, and renaming Applicants to Candidates.

## Database Schema

`profiles`

- `id uuid primary key references auth.users`
- `full_name text`
- `role text default 'recruiter'`
- `created_at timestamptz`
- `updated_at timestamptz`

`clients`

- `id uuid primary key`
- `name text not null`
- `industry text`
- `contact_name text`
- `contact_email text`
- `contact_phone text`
- `account_manager text`
- `status text`: `Active`, `Inactive`, `Prospect`
- `notes text`
- `created_at timestamptz`
- `updated_at timestamptz`

`jobs`

- `id uuid primary key`
- `client_id uuid references clients(id)`
- `title text not null`
- `location text`
- `salary_min numeric`
- `salary_max numeric`
- `employment_type text`
- `headcount integer`
- `description text`
- `recruiter_in_charge text`
- `priority text`: `Low`, `Medium`, `High`, `Urgent`
- `status text`: `Open`, `On Hold`, `Closed`, `Cancelled`
- `public_slug text unique`
- `created_at timestamptz`
- `updated_at timestamptz`

`applicants`

- `id uuid primary key`
- `full_name text not null`
- `phone text`
- `email text not null unique`
- `current_company text`
- `current_role text`
- `expected_salary numeric`
- `notice_period text`
- `source text`
- `resume_url text`
- `notes text`
- `created_at timestamptz`
- `updated_at timestamptz`

`applications`

- `id uuid primary key`
- `applicant_id uuid references applicants(id)`
- `job_id uuid references jobs(id)`
- `screening_status text`
- `internal_decision text`
- `submission_status text`
- `client_outcome text`
- `recruiter_notes text`
- `submitted_at timestamptz`
- `interview_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`
- unique applicant/job pair

`activity_notes`

- `id uuid primary key`
- `entity_type text`: `client`, `job`, `applicant`, `application`
- `entity_id uuid`
- `note text not null`
- `created_by uuid references auth.users`
- `created_at timestamptz`

## Route Map

- `/login`: Supabase Auth login.
- `/dashboard`: internal dashboard metrics.
- `/applicants`: applicant table, search, status filter, add/edit entry points.
- `/applicants/[id]`: applicant profile, resume link, application history, notes.
- `/clients`: client table, search, status filter, add/edit entry points.
- `/clients/[id]`: client profile, jobs, notes.
- `/jobs`: jobs table, search, status filter, add/edit entry points.
- `/jobs/[id]`: job detail, public form link, applications.
- `/jobs/[id]/tracker`: spreadsheet-style job tracker for one job.
- `/apply/[publicSlug]`: public application form.

## Shared Naming Rules

- Keep `Applicant` for people and `Application` for the applicant-job relationship.
- Use snake_case column names in Supabase and camelCase only for local component variables.
- Status text values are user-facing constants stored in `lib/constants.ts`.
- Routes use plural resource names for internal modules.
- Public route uses `publicSlug` because applicants should not see internal IDs.

## Status Definitions

`screening_status`

- `Not Screened`
- `Screening`
- `Passed Screening`
- `Failed Screening`

`internal_decision`

- `Pending Review`
- `Accepted for Submission`
- `Rejected Internally`
- `KIV`

`submission_status`

- `Not Sent`
- `Sent to Client`
- `Client Reviewing`
- `Interview Scheduled`

`client_outcome`

- `Pending`
- `Accepted`
- `Rejected by Client`
- `Offered`
- `Hired`
- `Withdrawn`

## Component Structure

- `app/(auth)`: unauthenticated login.
- `app/(dashboard)`: protected internal ATS pages.
- `app/apply`: public form pages.
- `components/layout`: shell, sidebar, top bar.
- `components/forms`: reusable client/job/applicant/public forms.
- `components/tables`: TanStack-backed resource tables.
- `components/ui`: shadcn-style primitives.
- `lib/supabase`: browser, server, and middleware clients.
- `lib/actions`: server actions for authenticated CRUD.
- `lib/queries`: typed read functions.
- `supabase`: SQL schema, RLS policies, and seed data.

## Security Model

- Internal pages call `requireUser()` and redirect unauthenticated users to `/login`.
- RLS is enabled on all application tables.
- Authenticated users can read and write internal records.
- Public users can read only open job details required by `/apply/[publicSlug]`.
- Public users submit applications through the `submit_public_application` RPC, which upserts the applicant and application without exposing applicant reads.
- Storage uses a `resumes` bucket. Public uploads are allowed only into the `public/` folder, while authenticated users can manage all resume files.
- The service role key is never used in frontend or server code for this MVP.
