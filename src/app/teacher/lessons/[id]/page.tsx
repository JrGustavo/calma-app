import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LessonRow {
  id: string;
  title: string;
  description: string | null;
  cefr_level: string;
  estimated_minutes: number;
  is_published: boolean;
  order_index: number;
}

interface TaskRow {
  id: string;
  task_type: string;
  content_json: unknown;
  order_index: number;
}

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: lessonData } = await supabase
    .from('lessons')
    .select('id, title, description, cefr_level, estimated_minutes, is_published, order_index')
    .eq('id', id)
    .single();

  if (!lessonData) notFound();
  const lesson = lessonData as LessonRow;

  const { data: tasksData } = await supabase
    .from('tasks')
    .select('id, task_type, content_json, order_index')
    .eq('lesson_id', id)
    .order('order_index', { ascending: true });
  const tasks = (tasksData ?? []) as TaskRow[];

  async function togglePublish() {
    'use server';
    const supabase = await createClient();
    await supabase
      .from('lessons')
      .update({ is_published: !lesson.is_published })
      .eq('id', lesson.id);
    revalidatePath(`/teacher/lessons/${lesson.id}`);
  }

  async function deleteLesson() {
    'use server';
    const supabase = await createClient();
    await supabase.from('lessons').delete().eq('id', lesson.id);
    redirect('/teacher/lessons');
  }

  async function addTask(formData: FormData) {
    'use server';
    const taskType = formData.get('task_type');
    const contentJsonStr = formData.get('content_json');

    if (typeof taskType !== 'string' || typeof contentJsonStr !== 'string') {
      return;
    }

    let contentJson: unknown;
    try {
      contentJson = JSON.parse(contentJsonStr);
    } catch {
      redirect(`/teacher/lessons/${lesson.id}?error=json`);
    }

    const supabase = await createClient();
    const { data: existing } = await supabase
      .from('tasks')
      .select('order_index')
      .eq('lesson_id', lesson.id)
      .order('order_index', { ascending: false })
      .limit(1);
    const lastOrder =
      ((existing ?? [])[0] as { order_index: number } | undefined)?.order_index ?? 0;

    await supabase.from('tasks').insert({
      lesson_id: lesson.id,
      task_type: taskType,
      content_json: contentJson,
      order_index: lastOrder + 1,
      max_duration_seconds: 180,
    });

    revalidatePath(`/teacher/lessons/${lesson.id}`);
  }

  async function deleteTask(formData: FormData) {
    'use server';
    const taskId = formData.get('task_id');
    if (typeof taskId !== 'string') return;
    const supabase = await createClient();
    await supabase.from('tasks').delete().eq('id', taskId);
    revalidatePath(`/teacher/lessons/${lesson.id}`);
  }

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/teacher/lessons"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <header>
            <p className="text-sm text-text-muted">Nivel {lesson.cefr_level}</p>
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            {lesson.description && (
              <p className="text-text-secondary">{lesson.description}</p>
            )}
          </header>

          <Card variant="elevated">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="font-medium">
                  {lesson.is_published ? 'Publicada' : 'Borrador'}
                </p>
                <p className="text-sm text-text-muted">
                  {tasks.length} tareas · {lesson.estimated_minutes} min
                </p>
              </div>
              <form action={togglePublish}>
                <Button type="submit">
                  {lesson.is_published ? 'Despublicar' : 'Publicar'}
                </Button>
              </form>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-3">Tareas</h2>
            {tasks.length === 0 ? (
              <p className="text-text-secondary mb-4">
                Agrega tareas con el formulario de abajo.
              </p>
            ) : (
              <ul className="divide-y divide-border-subtle mb-4">
                {tasks.map((t, i) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {i + 1}. {labelForType(t.task_type)}
                      </p>
                      <p className="text-xs text-text-muted truncate max-w-xs">
                        {previewContent(t.content_json)}
                      </p>
                    </div>
                    <form action={deleteTask}>
                      <input type="hidden" name="task_id" value={t.id} />
                      <Button type="submit" variant="ghost">
                        Eliminar
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card variant="elevated">
            <h2 className="text-lg font-bold mb-2">Agregar tarea</h2>
            <p className="text-sm text-text-secondary mb-4">
              Pega el JSON con el contenido de la tarea. Ver{' '}
              <Link href="/mediation-guide" className="underline">
                guía de formato
              </Link>
              .
            </p>

            <form action={addTask} className="space-y-3">
              <div>
                <label htmlFor="task_type" className="block text-sm font-medium mb-1.5">
                  Tipo
                </label>
                <select
                  id="task_type"
                  name="task_type"
                  required
                  defaultValue="vocab"
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                >
                  <option value="vocab">Vocabulario</option>
                  <option value="grammar">Gramática</option>
                  <option value="listening">Comprensión auditiva</option>
                  <option value="reading">Lectura</option>
                </select>
              </div>

              <div>
                <label htmlFor="content_json" className="block text-sm font-medium mb-1.5">
                  Contenido (JSON)
                </label>
                <textarea
                  id="content_json"
                  name="content_json"
                  rows={8}
                  required
                  placeholder={`{
  "word": "hello",
  "translation": "hola",
  "hint": "Saludo informal"
}`}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md font-mono text-sm"
                />
              </div>

              <Button type="submit">Agregar tarea</Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-2">Zona peligrosa</h2>
            <p className="text-sm text-text-secondary mb-4">
              Eliminar la lección borra también todas sus tareas.
            </p>
            <form action={deleteLesson}>
              <Button type="submit" variant="ghost">
                Eliminar lección
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}

function labelForType(type: string): string {
  return (
    {
      vocab: 'Vocabulario',
      grammar: 'Gramática',
      listening: 'Comprensión auditiva',
      reading: 'Lectura',
    }[type] ?? type
  );
}

function previewContent(content: unknown): string {
  if (!content || typeof content !== 'object') return '';
  const obj = content as Record<string, unknown>;
  if (typeof obj.word === 'string') return obj.word;
  if (typeof obj.prompt === 'string') return obj.prompt;
  return JSON.stringify(content).slice(0, 80);
}
