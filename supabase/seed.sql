insert into public.profiles (id, full_name, email, role)
select id, 'Shaneen Xinen', email, 'recruiter'
from auth.users
where email = 'shaneen.xinen@gmail.com'
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;

insert into public.profiles (id, full_name, email, role)
select id, 'Sharon', email, 'recruiter'
from auth.users
where email = 'sharon@gmail.com'
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;

insert into public.clients (id, name, industry, contact_name, contact_email, contact_phone, account_manager, status, notes)
values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Logistics', 'Logistics', 'Mei Tan', 'mei@northstar.example', '+65 6000 1001', 'Shane Hoxe', 'Active', 'Regional operations hiring.'),
  ('22222222-2222-2222-2222-222222222222', 'HelioPay', 'Fintech', 'Arun Nair', 'arun@heliopay.example', '+65 6000 1002', 'Shane Hoxe', 'Active', 'Fast-moving product team.'),
  ('33333333-3333-3333-3333-333333333333', 'Marina Health Group', 'Healthcare', 'Grace Lim', 'grace@marinahealth.example', '+65 6000 1003', 'Jamie Ong', 'Prospect', 'Needs follow up next month.')
on conflict (id) do nothing;

insert into public.jobs (id, client_id, title, location, salary_min, salary_max, employment_type, headcount, description, recruiter_in_charge, priority, status, public_slug)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Operations Manager', 'Singapore', 6500, 8500, 'Full-time', 1, 'Lead warehouse and last-mile operations.', 'Shane Hoxe', 'High', 'Open', 'operations-manager-northstar'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Senior Product Designer', 'Singapore', 8000, 11000, 'Full-time', 2, 'Own product design for payment workflows.', 'Jamie Ong', 'Urgent', 'Open', 'senior-product-designer-heliopay'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Clinic Administrator', 'Singapore', 3200, 4200, 'Full-time', 1, 'Support patient services and clinic scheduling.', 'Shane Hoxe', 'Medium', 'On Hold', 'clinic-administrator-marina')
on conflict (id) do nothing;

insert into public.applicants (id, full_name, phone, email, current_company, "current_role", expected_salary, notice_period, source, resume_url, notes)
values
  ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'Alicia Koh', '+65 8123 4567', 'alicia.koh@example.com', 'FastFleet', 'Operations Lead', 7800, '1 month', 'LinkedIn', null, 'Strong logistics background.'),
  ('bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb', 'Marcus Lee', '+65 8234 5678', 'marcus.lee@example.com', 'PayBridge', 'Product Designer', 9500, '2 months', 'Referral', null, 'Good portfolio, needs screening.'),
  ('cccccccc-1111-1111-1111-cccccccccccc', 'Nadia Rahman', '+65 8345 6789', 'nadia.rahman@example.com', 'ClinicOne', 'Front Desk Supervisor', 3800, 'Immediate', 'Job Board', null, 'Available immediately.')
on conflict (id) do nothing;

insert into public.applications (applicant_id, job_id, screening_status, internal_decision, submission_status, client_outcome, recruiter_notes, submitted_at)
values
  ('aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Passed Screening', 'Accepted for Submission', 'Sent to Client', 'Pending', 'Shared profile with client.', now() - interval '2 days'),
  ('bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Screening', 'Pending Review', 'Not Sent', 'Pending', 'Portfolio review pending.', null),
  ('cccccccc-1111-1111-1111-cccccccccccc', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Not Screened', 'Pending Review', 'Not Sent', 'Pending', 'Hold while job is paused.', null)
on conflict (applicant_id, job_id) do nothing;

insert into public.activity_notes (
  id,
  entity_type,
  entity_id,
  action,
  entity_label,
  note,
  created_by,
  created_by_email,
  created_at
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'client',
    '11111111-1111-1111-1111-111111111111',
    'created',
    'Northstar Logistics',
    'Created client Northstar Logistics',
    (select id from auth.users where email = 'shaneen.xinen@gmail.com'),
    'shaneen.xinen@gmail.com',
    now() - interval '6 days'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'job',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'created',
    'Operations Manager',
    'Created job Operations Manager',
    (select id from auth.users where email = 'shaneen.xinen@gmail.com'),
    'shaneen.xinen@gmail.com',
    now() - interval '5 days'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'applicant',
    'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa',
    'created',
    'Alicia Koh',
    'Created applicant Alicia Koh',
    (select id from auth.users where email = 'sharon@gmail.com'),
    'sharon@gmail.com',
    now() - interval '4 days'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'application',
    coalesce(
      (
        select id
        from public.applications
        where applicant_id = 'aaaaaaaa-1111-1111-1111-aaaaaaaaaaaa'
          and job_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      ),
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ),
    'updated status',
    'Alicia Koh',
    'Updated application status for Alicia Koh',
    (select id from auth.users where email = 'shaneen.xinen@gmail.com'),
    'shaneen.xinen@gmail.com',
    now() - interval '2 days'
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'applicant',
    'bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb',
    'updated',
    'Marcus Lee',
    'Updated applicant Marcus Lee',
    (select id from auth.users where email = 'sharon@gmail.com'),
    'sharon@gmail.com',
    now() - interval '1 day'
  )
on conflict (id) do update set
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  action = excluded.action,
  entity_label = excluded.entity_label,
  note = excluded.note,
  created_by = excluded.created_by,
  created_by_email = excluded.created_by_email,
  created_at = excluded.created_at;
