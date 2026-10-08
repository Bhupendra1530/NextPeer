-- NextPeer LMS. Run once in the Supabase SQL Editor as the database owner.
-- Separate lms_ tables preserve the existing learning and HR tables.
begin;

create table public.lms_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  role text not null default 'student' check (role in ('student', 'mentor')),
  created_at timestamptz not null default now()
);
create table public.lms_courses (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.lms_profiles(id),
  program_slug text not null,
  title text not null check (length(title) between 1 and 160),
  description text not null default '' check (length(description) <= 6000),
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.lms_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  student_id uuid not null references public.lms_profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  unique (course_id, student_id)
);
create table public.lms_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  module_title text not null default 'Core Learning' check (length(module_title) between 1 and 160),
  content text not null default '' check (length(content) <= 30000),
  recording_url text check (recording_url is null or recording_url ~ '^https://'),
  position integer not null default 1 check (position > 0),
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.lms_progress (
  student_id uuid not null references public.lms_profiles(id) on delete cascade,
  lesson_id uuid not null references public.lms_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);
create table public.lms_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  starts_at timestamptz not null,
  duration_minutes integer not null default 90 check (duration_minutes between 15 and 480),
  join_url text not null check (join_url ~ '^https://'),
  notes text not null default '' check (length(notes) <= 6000),
  cancelled boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.lms_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  instructions text not null check (length(instructions) between 1 and 12000),
  due_at timestamptz,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.lms_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.lms_assignments(id) on delete cascade,
  student_id uuid not null references public.lms_profiles(id) on delete cascade,
  answer text not null check (length(answer) between 1 and 20000),
  attachment_url text check (attachment_url is null or attachment_url ~ '^https://'),
  submitted_at timestamptz not null default now(),
  score integer check (score between 0 and 100),
  feedback text check (length(feedback) <= 6000),
  graded_at timestamptz,
  unique (assignment_id, student_id)
);
create table public.lms_announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  body text not null check (length(body) between 1 and 12000),
  created_at timestamptz not null default now()
);
create table public.lms_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  title text not null check (length(title) between 1 and 160),
  url text not null check (url ~ '^https://'),
  created_at timestamptz not null default now()
);

create index on public.lms_courses(mentor_id);
create index on public.lms_enrollments(student_id, status);
create index on public.lms_lessons(course_id, position);
create index on public.lms_sessions(course_id, starts_at);
create index on public.lms_assignments(course_id);
create index on public.lms_submissions(student_id);
create index on public.lms_announcements(course_id);
create index on public.lms_resources(course_id);

-- Helpers use a fixed search path and return only booleans. This avoids
-- recursive RLS policies while retaining explicit ownership checks.
create function public.lms_is_mentor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.lms_profiles where id = auth.uid() and role = 'mentor');
$$;
create function public.lms_owns_course(p_course uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.lms_courses c join public.lms_profiles p on p.id = c.mentor_id
    where c.id = p_course and c.mentor_id = auth.uid() and p.role = 'mentor');
$$;
create function public.lms_can_learn(p_course uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.lms_courses c join public.lms_enrollments e on e.course_id = c.id
    where c.id = p_course and c.published and e.student_id = auth.uid() and e.status = 'active');
$$;
create function public.lms_can_view_profile(p_student uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select p_student = auth.uid() or exists(select 1 from public.lms_enrollments e
    where e.student_id = p_student and public.lms_owns_course(e.course_id));
$$;

alter table public.lms_profiles enable row level security;
alter table public.lms_courses enable row level security;
alter table public.lms_enrollments enable row level security;
alter table public.lms_lessons enable row level security;
alter table public.lms_progress enable row level security;
alter table public.lms_sessions enable row level security;
alter table public.lms_assignments enable row level security;
alter table public.lms_submissions enable row level security;
alter table public.lms_announcements enable row level security;
alter table public.lms_resources enable row level security;

-- Profiles cannot be inserted or updated from the browser. In particular,
-- a student cannot promote themself by changing role or user_metadata.
create policy profiles_read on public.lms_profiles for select to authenticated
  using (public.lms_can_view_profile(id));
create policy courses_read on public.lms_courses for select to authenticated
  using ((mentor_id = auth.uid() and public.lms_is_mentor()) or public.lms_can_learn(id));
create policy courses_create on public.lms_courses for insert to authenticated
  with check (public.lms_is_mentor() and mentor_id = auth.uid());
create policy courses_update on public.lms_courses for update to authenticated
  using (public.lms_owns_course(id)) with check (mentor_id = auth.uid() and public.lms_is_mentor());
create policy enrollments_read on public.lms_enrollments for select to authenticated
  using (student_id = auth.uid() or public.lms_owns_course(course_id));
create policy enrollments_update on public.lms_enrollments for update to authenticated
  using (public.lms_owns_course(course_id)) with check (public.lms_owns_course(course_id));
create policy lessons_read on public.lms_lessons for select to authenticated
  using (public.lms_owns_course(course_id) or (published and public.lms_can_learn(course_id)));
create policy lessons_manage on public.lms_lessons for all to authenticated
  using (public.lms_owns_course(course_id)) with check (public.lms_owns_course(course_id));
create policy sessions_read on public.lms_sessions for select to authenticated
  using (public.lms_owns_course(course_id) or public.lms_can_learn(course_id));
create policy sessions_manage on public.lms_sessions for all to authenticated
  using (public.lms_owns_course(course_id)) with check (public.lms_owns_course(course_id));
create policy assignments_read on public.lms_assignments for select to authenticated
  using (public.lms_owns_course(course_id) or (published and public.lms_can_learn(course_id)));
create policy assignments_manage on public.lms_assignments for all to authenticated
  using (public.lms_owns_course(course_id)) with check (public.lms_owns_course(course_id));
create policy progress_read on public.lms_progress for select to authenticated
  using (exists(select 1 from public.lms_lessons l where l.id = lesson_id and
    (public.lms_owns_course(l.course_id) or (student_id = auth.uid() and public.lms_can_learn(l.course_id)))));
create policy progress_create on public.lms_progress for insert to authenticated
  with check (student_id = auth.uid() and exists(select 1 from public.lms_lessons l
    where l.id = lesson_id and l.published and public.lms_can_learn(l.course_id)));
create policy progress_remove on public.lms_progress for delete to authenticated
  using (student_id = auth.uid() and exists(select 1 from public.lms_lessons l
    where l.id = lesson_id and public.lms_can_learn(l.course_id)));
create policy submissions_read on public.lms_submissions for select to authenticated
  using (exists(select 1 from public.lms_assignments a where a.id = assignment_id and
    (public.lms_owns_course(a.course_id) or (student_id = auth.uid() and public.lms_can_learn(a.course_id)))));
create policy announcements_read on public.lms_announcements for select to authenticated
  using (public.lms_owns_course(course_id) or public.lms_can_learn(course_id));
create policy announcements_manage on public.lms_announcements for all to authenticated
  using (public.lms_owns_course(course_id)) with check (public.lms_owns_course(course_id));
create policy resources_read on public.lms_resources for select to authenticated
  using (public.lms_owns_course(course_id) or public.lms_can_learn(course_id));
create policy resources_manage on public.lms_resources for all to authenticated
  using (public.lms_owns_course(course_id)) with check (public.lms_owns_course(course_id));

-- New users always receive student privileges. Only the database owner
-- can assign mentor privileges, after identity verification.
create function public.lms_ensure_profile() returns public.lms_profiles
language plpgsql security definer set search_path = '' as $$
declare result public.lms_profiles;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.lms_profiles (id, full_name, email)
    select id, coalesce(raw_user_meta_data->>'full_name', ''), coalesce(email, '')
    from auth.users where id = auth.uid()
    on conflict (id) do update set email = excluded.email;
  select * into result from public.lms_profiles where id = auth.uid();
  return result;
end;
$$;
create function public.lms_enroll_student(p_course uuid, p_email text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare target_id uuid; result uuid;
begin
  if not public.lms_owns_course(p_course) then raise exception 'Course access denied'; end if;
  select id into target_id from auth.users where lower(email) = lower(trim(p_email)) and email_confirmed_at is not null;
  if target_id is null then raise exception 'Student must sign up and confirm their email first'; end if;
  insert into public.lms_profiles (id, full_name, email)
    select id, coalesce(raw_user_meta_data->>'full_name', ''), coalesce(email, '') from auth.users where id = target_id
    on conflict (id) do nothing;
  if exists(select 1 from public.lms_profiles where id = target_id and role <> 'student') then
    raise exception 'Only student accounts can be enrolled';
  end if;
  insert into public.lms_enrollments (course_id, student_id) values (p_course, target_id)
    on conflict (course_id, student_id) do update set status = 'active'
    returning id into result;
  return result;
end;
$$;
create function public.lms_submit_assignment(p_assignment uuid, p_answer text, p_url text default null) returns uuid
language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if not exists(select 1 from public.lms_assignments a where a.id = p_assignment and a.published
    and public.lms_can_learn(a.course_id)) then raise exception 'Assignment access denied'; end if;
  if length(trim(p_answer)) not between 1 and 20000 then raise exception 'Invalid answer'; end if;
  if p_url is not null and p_url !~ '^https://' then raise exception 'Invalid attachment URL'; end if;
  insert into public.lms_submissions (assignment_id, student_id, answer, attachment_url)
    values (p_assignment, auth.uid(), trim(p_answer), p_url)
    on conflict (assignment_id, student_id) do update
      set answer = excluded.answer, attachment_url = excluded.attachment_url, submitted_at = now(),
          score = null, feedback = null, graded_at = null
      where public.lms_submissions.graded_at is null
    returning id into result;
  if result is null then raise exception 'A graded submission cannot be changed'; end if;
  return result;
end;
$$;
create function public.lms_grade_submission(p_submission uuid, p_score integer, p_feedback text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
  if p_score not between 0 and 100 or p_score is null or length(p_feedback) > 6000 then raise exception 'Invalid grade'; end if;
  update public.lms_submissions s set score = p_score, feedback = p_feedback, graded_at = now()
    where s.id = p_submission and exists(select 1 from public.lms_assignments a
      where a.id = s.assignment_id and public.lms_owns_course(a.course_id))
    returning s.id into result;
  if result is null then raise exception 'Submission access denied'; end if;
  return result;
end;
$$;

revoke all on public.lms_profiles, public.lms_courses, public.lms_enrollments, public.lms_lessons,
  public.lms_progress, public.lms_sessions, public.lms_assignments, public.lms_submissions,
  public.lms_announcements, public.lms_resources from anon, authenticated;
grant select on public.lms_profiles, public.lms_courses, public.lms_enrollments, public.lms_lessons,
  public.lms_progress, public.lms_sessions, public.lms_assignments, public.lms_submissions,
  public.lms_announcements, public.lms_resources to authenticated;
grant insert, update on public.lms_courses to authenticated;
-- Restrict enrollment updates to status: a mentor cannot move students between courses.
grant update(status) on public.lms_enrollments to authenticated;
grant insert, update, delete on public.lms_lessons, public.lms_sessions, public.lms_assignments,
  public.lms_announcements, public.lms_resources to authenticated;
grant insert, delete on public.lms_progress to authenticated;
revoke all on function public.lms_is_mentor(), public.lms_owns_course(uuid), public.lms_can_learn(uuid),
  public.lms_can_view_profile(uuid), public.lms_ensure_profile(), public.lms_enroll_student(uuid, text),
  public.lms_submit_assignment(uuid, text, text), public.lms_grade_submission(uuid, integer, text) from public, anon;
grant execute on function public.lms_is_mentor(), public.lms_owns_course(uuid), public.lms_can_learn(uuid),
  public.lms_can_view_profile(uuid), public.lms_ensure_profile(), public.lms_enroll_student(uuid, text),
  public.lms_submit_assignment(uuid, text, text), public.lms_grade_submission(uuid, integer, text) to authenticated;
commit;
