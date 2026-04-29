# Supabase Setup

## Aplicar el schema inicial

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. En el sidebar: **🗃️ SQL Editor** → **"+ New query"**
3. Copia el contenido de `migrations/001_initial_schema.sql`
4. Pégalo en el editor → click **Run** (o `Ctrl/Cmd + Enter`)
5. Verifica en **🗃️ Table Editor** que aparezcan estas tablas:
   - `profiles`
   - `user_preferences`
   - `lessons`
   - `tasks`
   - `student_progress`
   - `session_logs`
   - `classroom_memberships`
   - `parent_student_links`

## Verificar que RLS está activa

En **🗃️ Table Editor**, cada tabla debe tener un candadito 🔒 al lado del nombre. Si no lo tiene, RLS no se activó — vuelve a correr el SQL.

## Configurar Auth (una sola vez)

1. **🔐 Authentication → Providers → Email**: deshabilita "Confirm email" para desarrollo
2. **🔐 Authentication → URL Configuration**:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** agregar `http://localhost:3000/**`

Cuando deploys a Vercel, vuelve y agrega tu URL de producción a Redirect URLs.

## Siguiente migración

`002_seed_data.sql` (próxima en Phase 5) — contendrá las 3 lecciones A1 de ejemplo.
