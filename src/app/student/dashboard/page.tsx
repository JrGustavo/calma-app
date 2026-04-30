import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { LevelSelector } from '@/components/student/LevelSelector';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const profile = await getUserProfile(supabase, user.id);
  const level = profile?.cefr_level ?? 'A1';

  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('id, title, estimated_minutes')
    .eq('cefr_level', level)
    .eq('is_published', true)
    .order('order_index', { ascending: true })
    .limit(1);

  const nextLesson = (lessonsData ?? [])[0] as
    | { id: string; title: string; estimated_minutes: number }
    | undefined;

  const { count: completedCount } = await supabase
    .from('student_progress')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('success', true);

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-8">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted mb-1">Hola,</p>
              <h1 className="text-3xl font-bold">
                {profile?.display_name ?? 'Estudiante'}
              </h1>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <p className="text-text-secondary">Tu nivel actual: {level}</p>
                <LevelSelector userId={user.id} currentLevel={level} />
              </div>
            </div>
            <LogoutButton />
          </header>

          <Card variant="elevated">
            <h2 className="text-lg font-bold mb-2">Tu próxima lección</h2>
            {nextLesson ? (
              <>
                <p className="text-text-primary mb-1">{nextLesson.title}</p>
                <p className="text-sm text-text-muted mb-4">
                  {nextLesson.estimated_minutes} min aprox.
                </p>
                <Link href={`/student/lesson/${level}/${nextLesson.id}`}>
                  <Button size="lg">Empezar</Button>
                </Link>
              </>
            ) : (
              <p className="text-text-secondary">
                No hay lecciones publicadas todavía para tu nivel.
              </p>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-2">Tu progreso</h2>
            <p className="text-text-secondary mb-4">
              Has completado {completedCount ?? 0} tareas en total.
            </p>
            <Link href="/student/lessons">
              <Button variant="secondary">Ver todas las lecciones</Button>
            </Link>
          </Card>
        </div>
      </main>
    </>
  );
}
