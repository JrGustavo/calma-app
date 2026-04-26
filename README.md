# Calma — Aprende inglés con calma

Aplicación web de bajo estímulo para aprendizaje de inglés diseñada para niños con TDAH. Construida como andamiaje externo para funciones ejecutivas: lecciones cortas, control sobre el ritmo de los estímulos, y herramientas de regulación cognitiva.

> **Estado actual: Fase 1 completa.** Sistema de diseño, paleta crema/petróleo, panel de batería cognitiva y componente `<GrammarMarker>` funcionando. Backend (Supabase) y autenticación se implementan en Fase 2.

## Stack

- **Next.js 14** (App Router) + TypeScript estricto
- **Tailwind CSS** con design tokens personalizados
- **Zustand** para preferencias cognitivas
- **Atkinson Hyperlegible** como tipografía (Google Fonts)
- **Lucide** para iconografía consistente
- Despliegue: **Vercel**

## Empezar localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev

# 3. Abrir el navegador
open http://localhost:3000
```

Visita `/showcase` para ver el sistema de diseño completo y validar:
- Paleta de colores
- Marcadores gramaticales (`<GrammarMarker>`)
- Botones y tarjetas
- Tipografía
- Panel de batería cognitiva (icono de engrane arriba a la derecha)

## Verificar el build

```bash
npm run build
npm run type-check
npm run lint
```

Los tres comandos deben pasar sin errores antes de hacer deploy.

## Desplegar en Vercel

### Opción A — desde la terminal (recomendado)

```bash
# 1. Instalar Vercel CLI (una sola vez)
npm install -g vercel

# 2. Iniciar sesión en Vercel (abre el navegador)
vercel login

# 3. Deploy a preview
vercel

# 4. Deploy a producción
vercel --prod
```

Vercel detecta automáticamente que es Next.js — no requiere configuración adicional para Fase 1 (no hay variables de entorno todavía).

### Opción B — desde GitHub

1. Crea un repositorio nuevo en GitHub
2. `git init && git add . && git commit -m "Phase 1: design system"`
3. `git remote add origin <url-de-tu-repo> && git push -u origin main`
4. En [vercel.com/new](https://vercel.com/new), importa el repo
5. Vercel detecta Next.js automáticamente, click en "Deploy"

## Estructura del proyecto

```
src/
├── app/
│   ├── globals.css          # CSS variables del design system
│   ├── layout.tsx           # Root layout con tipografía y data-attrs
│   ├── page.tsx             # Landing minimalista
│   └── showcase/
│       └── page.tsx         # Validación visual del sistema de diseño
├── components/
│   ├── lesson/
│   │   └── GrammarMarker.tsx        # ÚNICO uso permitido de azul petróleo
│   ├── settings/
│   │   └── CognitiveBatteryPanel.tsx # Panel de control cognitivo
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── lib/
│   └── utils.ts             # cn() para merge de clases
└── stores/
    └── preferences.ts       # Zustand store con persistencia local
```

## Reglas del sistema de diseño

Estas reglas son **inmutables**. Cualquier cambio futuro debe respetarlas:

1. **No usar `#FFFFFF` (blanco puro) en ningún lugar.** El fondo base es `#F5F1E8` (crema suave).
2. **El azul petróleo (`#1F4E5F`) está reservado.** Solo se usa en:
   - El componente `<GrammarMarker>` para resaltar estructuras gramaticales en texto en inglés
   - El indicador "Modo Enfoque Activo" durante lecciones
3. **Sin animaciones distractoras.** Solo transiciones de color (200ms máx) y barras de progreso. Todo debe respetar `prefers-reduced-motion` y el toggle del panel.
4. **Tap targets mínimos de 44px** en todos los elementos interactivos.
5. **Líneas de texto máximo 65 caracteres** para reducir saturación visual.
6. **Una tarea por pantalla** durante las lecciones (Fase 2+).

## Próximas fases

- **Fase 2 — Backend.** Schema de Supabase, RLS policies, autenticación con `@supabase/ssr`, sincronización de preferencias cognitivas.
- **Fase 3 — Módulo del estudiante.** Lesson runner, micro-tareas (vocab/gramática/listening/reading), `FocusShield`.
- **Fase 4 — Módulo del docente.** Dashboard con progreso en tiempo real, gestión de lecciones, vista por estudiante.
- **Fase 5 — Contenido y pulido.** Seed con 3 lecciones A1, guía de mediación, PWA básica, optimizaciones de performance.

## Licencia

Por definir.
# calma-app
