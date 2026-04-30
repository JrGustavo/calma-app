import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/queries';
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
  order_index: number;
}

export default async function LessonsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const profile = await getUserProfile(supabase, user.id);
  const level = profile?.cefr_level ?? 'A1';

  const { data } = await supabase
    .from('lessons')
    .select('id, title, description, cefr_level, estimated_minutes, order_index')
    .eq('cefr_level', level)
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  const lessons = (data ?? []) as LessonRow[];

  // Cargar progreso para marcar lecciones completadas
  const { data: progressData } = await supabase
    .from('student_progress')
    .select('task_id')
    .eq('student_id', user.id)
    .eq('success', true);

  const completedTaskIds = new Set(
    ((progressData ?? []) as { task_id: string }[]).map((r) => r.task_id)
  );

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>

          <header>
            <h1 className="text-3xl font-bold mb-2">Tus lecciones</h1>
            <p className="text-text-secondary">Nivel {level}</p>
          </header>

          {lessons.length === 0 ? (
            <Card>
              <p className="text-text-secondary">
                Todavía no hay lecciones publicadas para tu nivel. Pídele a tu
                docente o vuelve más tarde.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  hasProgress={completedTaskIds.size > 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function LessonCard({
  lesson,
  hasProgress,
}: {
  lesson: LessonRow;
  hasProgress: boolean;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold mb-1">{lesson.title}</h2>
          {lesson.description && (
            <p className="text-sm text-text-secondary mb-2">
              {lesson.description}
            </p>
          )}
          <p className="text-xs text-text-muted">
            {lesson.estimated_minutes} min aprox.
          </p>
        </div>
        <Link href={`/student/lesson/${lesson.cefr_level}/${lesson.id}`}>
          <Button>{hasProgress ? 'Continuar' : 'Empezar'}</Button>
        </Link>
      </div>
    </Card>
  );
}
