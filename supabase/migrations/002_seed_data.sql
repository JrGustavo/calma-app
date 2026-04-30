-- ============================================================================
-- Calma App — Seed data: 3 lecciones A1 con 5 tareas cada una
-- Aplicar en SQL Editor de Supabase DESPUÉS de 001_initial_schema.sql
-- ============================================================================

-- ─── Lección 1: Greetings & Introductions ───────────────────────────────────

with lesson1 as (
  insert into public.lessons (cefr_level, title, description, order_index, estimated_minutes, is_published)
  values ('A1', 'Saludos y presentaciones', 'Aprende a saludar y presentarte en inglés.', 1, 10, true)
  returning id
)
insert into public.tasks (lesson_id, task_type, content_json, order_index, max_duration_seconds)
select id, 'vocab', '{"word":"hello","translation":"hola","hint":"Saludo informal, se usa en cualquier momento del día."}'::jsonb, 1, 120 from lesson1
union all
select id, 'vocab', '{"word":"goodbye","translation":"adiós","hint":"Despedida formal."}'::jsonb, 2, 120 from lesson1
union all
select id, 'grammar', '{"sentence_segments":[{"type":"text","content":"My name "},{"type":"marker","content":"is","marker_type":"auxiliary","hint":"Verbo to be en tercera persona del singular."},{"type":"text","content":" Maria."}],"prompt":"¿Qué palabra está marcada?","options":["Verbo","Sustantivo","Adjetivo"],"correct":"Verbo"}'::jsonb, 3, 180 from lesson1
union all
select id, 'reading', '{"text_segments":[{"type":"text","content":"Hi! "},{"type":"marker","content":"I","marker_type":"pronoun","hint":"Pronombre de primera persona."},{"type":"text","content":" am Tom. Nice to meet you."}],"prompt":"¿Cómo se llama la persona?","options":["Tom","Maria","Sam"],"correct":"Tom"}'::jsonb, 4, 180 from lesson1
union all
select id, 'grammar', '{"sentence_segments":[{"type":"marker","content":"How","marker_type":"general","hint":"Palabra interrogativa: cómo."},{"type":"text","content":" are you?"}],"prompt":"¿Qué tipo de oración es?","options":["Pregunta","Afirmación","Negación"],"correct":"Pregunta"}'::jsonb, 5, 180 from lesson1;

-- ─── Lección 2: Family Members ──────────────────────────────────────────────

with lesson2 as (
  insert into public.lessons (cefr_level, title, description, order_index, estimated_minutes, is_published)
  values ('A1', 'Miembros de la familia', 'Vocabulario de familia y posesivos.', 2, 10, true)
  returning id
)
insert into public.tasks (lesson_id, task_type, content_json, order_index, max_duration_seconds)
select id, 'vocab', '{"word":"mother","translation":"madre","hint":"También se dice mom o mum (informal)."}'::jsonb, 1, 120 from lesson2
union all
select id, 'vocab', '{"word":"father","translation":"padre","hint":"También se dice dad (informal)."}'::jsonb, 2, 120 from lesson2
union all
select id, 'vocab', '{"word":"sister","translation":"hermana"}'::jsonb, 3, 120 from lesson2
union all
select id, 'grammar', '{"sentence_segments":[{"type":"text","content":"This is "},{"type":"marker","content":"my","marker_type":"pronoun","hint":"Adjetivo posesivo: mi/mis."},{"type":"text","content":" sister."}],"prompt":"¿Qué indica la palabra marcada?","options":["Posesión","Lugar","Tiempo"],"correct":"Posesión"}'::jsonb, 4, 180 from lesson2
union all
select id, 'reading', '{"text_segments":[{"type":"text","content":"This is Ana. "},{"type":"marker","content":"She","marker_type":"pronoun","hint":"Pronombre femenino, tercera persona."},{"type":"text","content":" is my sister."}],"prompt":"¿Quién es Ana?","options":["La hermana","La madre","Una amiga"],"correct":"La hermana"}'::jsonb, 5, 180 from lesson2;

-- ─── Lección 3: Numbers 1-10 ────────────────────────────────────────────────

with lesson3 as (
  insert into public.lessons (cefr_level, title, description, order_index, estimated_minutes, is_published)
  values ('A1', 'Números del 1 al 10', 'Aprende a contar en inglés.', 3, 10, true)
  returning id
)
insert into public.tasks (lesson_id, task_type, content_json, order_index, max_duration_seconds)
select id, 'vocab', '{"word":"one","translation":"uno"}'::jsonb, 1, 120 from lesson3
union all
select id, 'vocab', '{"word":"five","translation":"cinco"}'::jsonb, 2, 120 from lesson3
union all
select id, 'vocab', '{"word":"ten","translation":"diez"}'::jsonb, 3, 120 from lesson3
union all
select id, 'grammar', '{"sentence_segments":[{"type":"text","content":"I have "},{"type":"marker","content":"three","marker_type":"general","hint":"Número cardinal."},{"type":"text","content":" cats."}],"prompt":"¿Cuántos gatos hay?","options":["1","3","5"],"correct":"3"}'::jsonb, 4, 180 from lesson3
union all
select id, 'reading', '{"text_segments":[{"type":"text","content":"There are "},{"type":"marker","content":"seven","marker_type":"general"},{"type":"text","content":" days in a week."}],"prompt":"¿Cuántos días tiene la semana?","options":["5","6","7"],"correct":"7"}'::jsonb, 5, 180 from lesson3;
