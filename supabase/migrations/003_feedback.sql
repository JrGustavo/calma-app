-- ============================================================================
-- Calma App — Tabla de feedback
-- Aplicar en SQL Editor de Supabase
-- ============================================================================

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_role text,
  rating int check (rating between 1 and 5),
  category text check (category in ('uso', 'diseno', 'contenido', 'tecnico', 'sugerencia', 'otro')),
  message text not null check (length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

comment on table public.feedback is 'Comentarios de usuarios (anónimos o autenticados) sobre la experiencia';

create index if not exists idx_feedback_created on public.feedback(created_at desc);

-- RLS
alter table public.feedback enable row level security;

-- Cualquiera (autenticado o anónimo) puede insertar feedback
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);

-- Solo el creador puede leer su propio feedback (si está autenticado)
create policy "Users can read their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
