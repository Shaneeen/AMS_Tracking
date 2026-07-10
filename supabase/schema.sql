create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'recruiter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text unique;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  contact_name text,
  contact_email text,
  contact_phone text,
  account_manager text,
  status text not null default 'Active' check (status in ('Active', 'Inactive', 'Prospect')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  location text,
  salary_min numeric,
  salary_max numeric,
  employment_type text,
  headcount integer not null default 1 check (headcount > 0),
  description text,
  recruiter_in_charge text,
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  status text not null default 'Open' check (status in ('Open', 'On Hold', 'Closed', 'Cancelled')),
  public_slug text not null unique default encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applicants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text not null unique,
  current_company text,
  "current_role" text,
  expected_salary numeric,
  notice_period text,
  source text,
  resume_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applicants add column if not exists "current_role" text;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.applicants(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  screening_status text not null default 'Not Screened' check (screening_status in ('Not Screened', 'Screening', 'Passed Screening', 'Failed Screening')),
  internal_decision text not null default 'Pending Review' check (internal_decision in ('Pending Review', 'Accepted for Submission', 'Rejected Internally', 'KIV')),
  submission_status text not null default 'Not Sent' check (submission_status in ('Not Sent', 'Sent to Client', 'Client Reviewing', 'Interview Scheduled')),
  client_outcome text not null default 'Pending' check (client_outcome in ('Pending', 'Accepted', 'Rejected by Client', 'Offered', 'Hired', 'Withdrawn')),
  recruiter_notes text,
  submitted_at timestamptz,
  interview_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_applicant_job_unique unique (applicant_id, job_id)
);

create table if not exists public.activity_notes (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('client', 'job', 'applicant', 'application')),
  entity_id uuid not null,
  action text not null default 'note',
  entity_label text,
  note text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_by_email text,
  created_at timestamptz not null default now()
);

alter table public.activity_notes add column if not exists action text not null default 'note';
alter table public.activity_notes add column if not exists entity_label text;
alter table public.activity_notes add column if not exists created_by_email text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at before update on public.clients for each row execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at before update on public.jobs for each row execute function public.set_updated_at();

drop trigger if exists applicants_set_updated_at on public.applicants;
create trigger applicants_set_updated_at before update on public.applicants for each row execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at before update on public.applications for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.jobs enable row level security;
alter table public.applicants enable row level security;
alter table public.applications enable row level security;
alter table public.activity_notes enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles" on public.profiles for select to authenticated using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Authenticated users can manage clients" on public.clients;
create policy "Authenticated users can manage clients" on public.clients for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can manage jobs" on public.jobs;
create policy "Authenticated users can manage jobs" on public.jobs for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can manage applicants" on public.applicants;
create policy "Authenticated users can manage applicants" on public.applicants for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can manage applications" on public.applications;
create policy "Authenticated users can manage applications" on public.applications for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can manage activity notes" on public.activity_notes;
create policy "Authenticated users can manage activity notes" on public.activity_notes for all to authenticated using (true) with check (true);

drop policy if exists "Public can read open application jobs" on public.jobs;
create policy "Public can read open application jobs" on public.jobs
  for select to anon
  using (status = 'Open');

create or replace function public.submit_public_application(
  p_job_id uuid,
  p_full_name text,
  p_phone text,
  p_email text,
  p_current_company text,
  p_current_role text,
  p_expected_salary numeric,
  p_notice_period text,
  p_source text,
  p_resume_url text,
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_applicant_id uuid;
  v_application_id uuid;
begin
  if not exists (select 1 from public.jobs where id = p_job_id and status = 'Open') then
    raise exception 'This job is not accepting applications';
  end if;

  insert into public.applicants (
    full_name,
    phone,
    email,
    current_company,
    "current_role",
    expected_salary,
    notice_period,
    source,
    resume_url,
    notes
  )
  values (
    p_full_name,
    p_phone,
    lower(p_email),
    p_current_company,
    p_current_role,
    p_expected_salary,
    p_notice_period,
    p_source,
    p_resume_url,
    p_notes
  )
  on conflict (email) do update set
    full_name = excluded.full_name,
    phone = excluded.phone,
    current_company = excluded.current_company,
    "current_role" = excluded."current_role",
    expected_salary = excluded.expected_salary,
    notice_period = excluded.notice_period,
    source = excluded.source,
    resume_url = coalesce(excluded.resume_url, public.applicants.resume_url),
    notes = excluded.notes
  returning id into v_applicant_id;

  insert into public.applications (applicant_id, job_id, recruiter_notes)
  values (v_applicant_id, p_job_id, p_notes)
  on conflict (applicant_id, job_id) do update set
    recruiter_notes = excluded.recruiter_notes
  returning id into v_application_id;

  insert into public.activity_notes (
    entity_type,
    entity_id,
    action,
    entity_label,
    note,
    created_by_email
  )
  values (
    'application',
    v_application_id,
    'submitted',
    p_full_name,
    'Public application submitted by ' || p_full_name,
    lower(p_email)
  );

  return v_applicant_id;
end;
$$;

revoke all on function public.submit_public_application(uuid, text, text, text, text, text, numeric, text, text, text, text) from public;
grant execute on function public.submit_public_application(uuid, text, text, text, text, text, numeric, text, text, text, text) to anon;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  true,
  10485760,
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can manage resumes" on storage.objects;
create policy "Authenticated users can manage resumes" on storage.objects
  for all to authenticated
  using (bucket_id = 'resumes')
  with check (bucket_id = 'resumes');

drop policy if exists "Public can upload resumes" on storage.objects;
create policy "Public can upload resumes" on storage.objects
  for insert to anon
  with check (bucket_id = 'resumes' and name like 'public/%');

drop policy if exists "Public can read public resumes" on storage.objects;
create policy "Public can read public resumes" on storage.objects
  for select to anon
  using (bucket_id = 'resumes' and name like 'public/%');
