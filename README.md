# Calma — Aprende inglés con calma

Aplicación web de bajo estímulo para aprendizaje de inglés diseñada para niños con TDAH. Construida como andamiaje externo para funciones ejecutivas: lecciones cortas, control sobre el ritmo de los estímulos, y herramientas de regulación cognitiva.

> **Estado actual: Fase 2 completa.** Sistema de diseño + Supabase backend + autenticación + sincronización de preferencias cognitivas. Próxima fase: módulo de aprendizaje del estudiante.

## Stack

- **Next.js 14** (App Router) + TypeScript estricto
- **Tailwind CSS** con design tokens personalizados
- **Supabase** (Auth + PostgreSQL + RLS)
- **Zustand** para preferencias cognitivas (sincronizadas con Supabase)
- **Atkinson Hyperlegible** como tipografía
- Despliegue: **Vercel**

## Setup local

### 1. Clonar / descomprimir

```bash
unzip calma-app-phase2.zip
cd calma-app
npm install
```

### 2. Configurar Supabase

a) Crea un proyecto en [supabase.com](https://supabase.com).

b) Aplica el schema:
- En Supabase Dashboard → **SQL Editor** → **New query**
- Pega el contenido de `supabase/migrations/001_initial_schema.sql`
- Click **Run**

c) Configura Auth:
- **Authentication → Providers → Email**: desactiva "Confirm email" (en desarrollo)
- **Authentication → URL Configuration → Site URL**: `http://localhost:3000`
- **Authentication → URL Configuration → Redirect URLs**: agrega `http://localhost:3000/**`

d) Copia tus credenciales desde **Project Settings → API**:

```bash
cp .env.example .env.local
# edita .env.local con tus 3 credenciales
```

### 3. Levantar dev server

```bash
npm run dev
```

Abre `http://localhost:3000`. Crea cuenta, prueba login, panel de batería cognitiva, etc.

### 4. Verificar el build

```bash
npm run build
npm run type-check
```

Los dos deben pasar sin errores antes de hacer deploy.

## Despliegue en Vercel

### Variables de entorno en Vercel

En tu dashboard de Vercel → Settings → Environment Variables, agrega:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Actualizar URLs en Supabase

Tras el deploy, ve a Supabase → **Authentication → URL Configuration** y agrega:
- **Site URL**: tu URL de producción (ej. `https://calma-app.vercel.app`)
- **Redirect URLs**: agrega `https://calma-app.vercel.app/**`

Sin esto, el login en producción fallará silenciosamente.

## Estructura del proyecto

```
calma-app/
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql    # Schema completo + RLS + triggers
│   └── README.md
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Grupo de rutas sin layout protegido
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── logout/route.ts
│   │   ├── student/dashboard/page.tsx
│   │   ├── teacher/dashboard/page.tsx
│   │   ├── parent/dashboard/page.tsx
│   │   ├── showcase/page.tsx          # Sistema de diseño
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                   # Landing
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LogoutButton.tsx
│   │   │   └── PreferencesHydrator.tsx
│   │   ├── lesson/
│   │   │   └── GrammarMarker.tsx
│   │   ├── settings/
│   │   │   └── CognitiveBatteryPanel.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server client
│   │   │   └── middleware.ts          # Auth refresh + route protection
│   │   └── utils.ts
│   ├── stores/
│   │   └── preferences.ts             # Zustand + Supabase sync
│   ├── types/
│   │   └── database.ts                # TS types del schema
│   └── middleware.ts                  # Next.js middleware
├── package.json
├── tailwind.config.ts
└── README.md
```

## Reglas inmutables del sistema de diseño

1. **No usar `#FFFFFF` (blanco puro)** en ningún lugar. Fondo base: `#F5F1E8`.
2. **El azul petróleo (`#1F4E5F`) está reservado.** Solo se usa en:
   - El componente `<GrammarMarker>` para marcar gramática en texto en inglés
   - El indicador "Modo Enfoque Activo" durante lecciones
3. **Sin animaciones distractoras.** Solo transiciones de 200ms y barras de progreso. Todo respeta `prefers-reduced-motion` y el toggle.
4. **Tap targets mínimos de 44px.**
5. **Líneas máximo 65 caracteres.**
6. **Una tarea por pantalla** durante las lecciones.

## Modelo de datos

8 tablas principales:

- `profiles` — perfil de cada usuario (rol, nombre, nivel CEFR)
- `user_preferences` — configuración del Panel de Batería Cognitiva
- `lessons` — lecciones por nivel del MCER (A1/A2/B1/B2)
- `tasks` — micro-tareas dentro de cada lección
- `student_progress` — registro de cada intento de cada tarea
- `session_logs` — sesiones de aprendizaje y `focus_breaks` del Modo Enfoque
- `classroom_memberships` — relación docente ↔ estudiantes
- `parent_student_links` — relación padre/madre ↔ hijo/a

Todas con RLS activa. Un docente solo ve estudiantes de sus aulas; un padre solo ve sus hijos vinculados; un estudiante solo ve sus propios datos.

## Próximas fases

- **Fase 3 — Módulo del estudiante.** Lesson runner, micro-tareas (vocab/grammar/listening/reading), `FocusShield`.
- **Fase 4 — Módulo del docente.** Dashboard con progreso real, gestión de lecciones, vista por estudiante.
- **Fase 5 — Contenido y pulido.** Seed con 3 lecciones A1, guía de mediación, PWA básica, optimizaciones de performance.

## Licencia

Por definir.
