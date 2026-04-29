-- ============================================================================
-- Calma App — Schema completo
-- Aplicar en SQL Editor de Supabase: una sola corrida
-- ============================================================================

-- ─── 1. Profiles (extiende auth.users) ──────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'parent')),
  display_name text not null,
  cefr_level text default 'A1' check (cefr_level in ('A1', 'A2', 'B1', 'B2')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Datos de perfil de cada usuario, vinculados a auth.users';

-- ─── 2. User preferences (Cognitive Battery Panel) ──────────────────────────

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  font_size_scale numeric(3,2) not null default 1.00
    check (font_size_scale in (1.00, 1.15, 1.30, 1.50)),
  contrast_mode text not null default 'soft'
    check (contrast_mode in ('soft', 'medium', 'high')),
  audio_speed numeric(3,2) not null default 1.00
    check (audio_speed in (0.50, 0.75, 1.00, 1.25)),
  reduce_motion boolean not null default false,
  updated_at timestamptz not null default now()
);

comment on table public.user_preferences is 'Configuración del Panel de Batería Cognitiva por usuario';

-- ─── 3. Lessons (alineadas a MCER) ──────────────────────────────────────────

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2')),
  title text not null,
  description text,
  order_index int not null,
  estimated_minutes int not null default 10,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique(cefr_level, order_index)
);

comment on table public.lessons is 'Lecciones agrupadas por nivel del Marco Común Europeo de Referencia';

-- ─── 4. Tasks (micro-learning units) ────────────────────────────────────────

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  task_type text not null check (task_type in ('vocab', 'grammar', 'listening', 'reading')),
  content_json jsonb not null,
  correct_answer text,
  order_index int not null,
  max_duration_seconds int not null default 180,
  created_at timestamptz not null default now()
);

comment on table public.tasks is 'Micro-tareas dentro de cada lección. content_json contiene prompt, opciones, audio_url, etc.';

-- ─── 5. Student progress ────────────────────────────────────────────────────

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  completed_at timestamptz not null default now(),
  time_spent_seconds int not null,
  attempts int not null default 1,
  success boolean not null,
  score int
);

comment on table public.student_progress is 'Registro de cada intento de cada tarea por cada estudiante';

-- ─── 6. Session logs (Focus Shield tracking) ────────────────────────────────

create table if not exists public.session_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  shield_mode_active boolean not null default true,
  focus_breaks int not null default 0
);

comment on table public.session_logs is 'Registro de sesiones de aprendizaje. focus_breaks cuenta cuántas veces el estudiante perdió el foco';

-- ─── 7. Classroom memberships ───────────────────────────────────────────────

create table if not exists public.classroom_memberships (
  id uuid primary key default gen_random_uuid(),
  classroom_name text not null,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(teacher_id, student_id)
);

comment on table public.classroom_memberships is 'Relación docente ↔ estudiante. Permite a docentes ver progreso de sus alumnos';

-- ─── 8. Parent-Student links ────────────────────────────────────────────────

create table if not exists public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(parent_id, student_id)
);

comment on table public.parent_student_links is 'Relación padre/madre ↔ estudiante. Permite a padres ver progreso de sus hijos';

-- ─── Índices para queries frecuentes ────────────────────────────────────────

create index if not exists idx_progress_student_date
  on public.student_progress(student_id, completed_at desc);

create index if not exists idx_sessions_student_date
  on public.session_logs(student_id, started_at desc);

create index if not exists idx_tasks_lesson_order
  on public.tasks(lesson_id, order_index);

create index if not exists idx_lessons_level_order
  on public.lessons(cefr_level, order_index)
  where is_published = true;

create index if not exists idx_classroom_teacher
  on public.classroom_memberships(teacher_id);

create index if not exists idx_classroom_student
  on public.classroom_memberships(student_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: cuando un usuario se registra en auth.users, crear su profile
-- y sus preferencias por defecto. Toma role + display_name del raw_user_meta_data.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_display_name text;
begin
  -- Sacamos role y display_name del metadata enviado al signup
  v_role := coalesce(new.raw_user_meta_data->>'role', 'student');
  v_display_name := coalesce(
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );

  -- Validamos que el rol sea uno permitido (defensa anti-tampering)
  if v_role not in ('student', 'teacher', 'parent') then
    v_role := 'student';
  end if;

  insert into public.profiles (id, role, display_name)
  values (new.id, v_role, v_display_name);

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: actualizar updated_at automáticamente

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_preferences on public.user_preferences;
create trigger touch_preferences before update on public.user_preferences
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- RLS — Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.lessons enable row level security;
alter table public.tasks enable row level security;
alter table public.student_progress enable row level security;
alter table public.session_logs enable row level security;
alter table public.classroom_memberships enable row level security;
alter table public.parent_student_links enable row level security;

-- ─── Helper function: obtener rol del usuario actual ────────────────────────

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ─── PROFILES ───────────────────────────────────────────────────────────────

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Docentes pueden ver perfiles de sus estudiantes
create policy "Teachers can read their students profiles"
  on public.profiles for select
  using (
    id in (
      select student_id from public.classroom_memberships
      where teacher_id = auth.uid()
    )
  );

-- Padres pueden ver perfiles de sus hijos
create policy "Parents can read linked student profiles"
  on public.profiles for select
  using (
    id in (
      select student_id from public.parent_student_links
      where parent_id = auth.uid()
    )
  );

-- ─── USER PREFERENCES ───────────────────────────────────────────────────────

create policy "Users can read their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

-- ─── LESSONS ────────────────────────────────────────────────────────────────

-- Cualquier autenticado puede leer lecciones publicadas
create policy "Authenticated users can read published lessons"
  on public.lessons for select
  using (auth.role() = 'authenticated' and is_published = true);

-- Docentes pueden leer todas las lecciones (incluso borradores)
create policy "Teachers can read all lessons"
  on public.lessons for select
  using (public.current_user_role() = 'teacher');

-- Solo docentes pueden crear/editar/borrar lecciones
create policy "Teachers can manage lessons"
  on public.lessons for all
  using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

-- ─── TASKS ──────────────────────────────────────────────────────────────────

create policy "Authenticated users can read tasks of published lessons"
  on public.tasks for select
  using (
    auth.role() = 'authenticated'
    and lesson_id in (select id from public.lessons where is_published = true)
  );

create policy "Teachers can manage tasks"
  on public.tasks for all
  using (public.current_user_role() = 'teacher')
  with check (public.current_user_role() = 'teacher');

-- ─── STUDENT PROGRESS ───────────────────────────────────────────────────────

create policy "Students can read their own progress"
  on public.student_progress for select
  using (auth.uid() = student_id);

create policy "Students can insert their own progress"
  on public.student_progress for insert
  with check (auth.uid() = student_id);

-- Docentes ven el progreso de sus estudiantes asignados
create policy "Teachers can read their students progress"
  on public.student_progress for select
  using (
    student_id in (
      select student_id from public.classroom_memberships
      where teacher_id = auth.uid()
    )
  );

-- Padres ven el progreso de sus hijos
create policy "Parents can read linked students progress"
  on public.student_progress for select
  using (
    student_id in (
      select student_id from public.parent_student_links
      where parent_id = auth.uid()
    )
  );

-- ─── SESSION LOGS ───────────────────────────────────────────────────────────

create policy "Students manage their own sessions"
  on public.session_logs for all
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "Teachers can read their students sessions"
  on public.session_logs for select
  using (
    student_id in (
      select student_id from public.classroom_memberships
      where teacher_id = auth.uid()
    )
  );

create policy "Parents can read linked students sessions"
  on public.session_logs for select
  using (
    student_id in (
      select student_id from public.parent_student_links
      where parent_id = auth.uid()
    )
  );

-- ─── CLASSROOM MEMBERSHIPS ──────────────────────────────────────────────────

create policy "Teachers can manage their own classrooms"
  on public.classroom_memberships for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "Students can read their classroom memberships"
  on public.classroom_memberships for select
  using (auth.uid() = student_id);

-- ─── PARENT-STUDENT LINKS ───────────────────────────────────────────────────

create policy "Parents can manage their own student links"
  on public.parent_student_links for all
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

create policy "Students can read their parent links"
  on public.parent_student_links for select
  using (auth.uid() = student_id);
