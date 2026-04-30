import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TaskRunner } from '@/components/lesson/TaskRunner';

interface LessonPageProps {
  params: Promise<{ level: string; id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Cargar la lección
  const { data: lessonData, error: lessonError } = await supabase
    .from('lessons')
    .select('id, title, cefr_level, is_published')
    .eq('id', id)
    .single();

  if (lessonError || !lessonData) notFound();

  const lesson = lessonData as {
    id: string;
    title: string;
    cefr_level: string;
    is_published: boolean;
  };

  if (!lesson.is_published) notFound();

  // Cargar las tareas ordenadas
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('id, task_type, content_json, order_index')
    .eq('lesson_id', id)
    .order('order_index', { ascending: true });

  if (tasksError || !tasksData || tasksData.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-prose text-center">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
          <p className="text-text-secondary">
            Esta lección todavía no tiene tareas disponibles.
          </p>
        </div>
      </main>
    );
  }

  const tasks = tasksData as Array<{
    id: string;
    task_type: 'vocab' | 'grammar' | 'listening' | 'reading';
    content_json: unknown;
    order_index: number;
  }>;

  return (
    <TaskRunner
      studentId={user.id}
      lessonId={lesson.id}
      lessonTitle={lesson.title}
      tasks={tasks}
    />
  );
}
