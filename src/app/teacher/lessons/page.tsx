import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LessonRow {
  id: string;
  title: string;
  cefr_level: string;
  is_published: boolean;
  estimated_minutes: number;
  order_index: number;
}

export default async function TeacherLessonsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase
    .from('lessons')
    .select('id, title, cefr_level, is_published, estimated_minutes, order_index')
    .order('cefr_level', { ascending: true })
    .order('order_index', { ascending: true });

  const lessons = (data ?? []) as LessonRow[];

  // Agrupar por nivel
  const byLevel: Record<string, LessonRow[]> = {};
  lessons.forEach((l) => {
    byLevel[l.cefr_level] = byLevel[l.cefr_level] ?? [];
    byLevel[l.cefr_level].push(l);
  });

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>

          <header className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lecciones</h1>
              <p className="text-text-secondary">
                {lessons.length} lecciones en total
              </p>
            </div>
            <Link href="/teacher/lessons/new">
              <Button>
                <Plus className="w-4 h-4" /> Nueva lección
              </Button>
            </Link>
          </header>

          {lessons.length === 0 ? (
            <Card>
              <p className="text-text-secondary">
                Aún no hay lecciones creadas. Crea la primera con el botón de
                arriba.
              </p>
            </Card>
          ) : (
            (['A1', 'A2', 'B1', 'B2'] as const).map((level) =>
              byLevel[level] ? (
                <section key={level} className="space-y-3">
                  <h2 className="text-xl font-bold">Nivel {level}</h2>
                  {byLevel[level].map((lesson) => (
                    <Card key={lesson.id}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold mb-1">{lesson.title}</h3>
                          <p className="text-sm text-text-muted">
                            {lesson.estimated_minutes} min ·{' '}
                            {lesson.is_published
                              ? 'Publicada'
                              : 'Borrador'}
                          </p>
                        </div>
                        <Link href={`/teacher/lessons/${lesson.id}`}>
                          <Button variant="secondary">Editar</Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </section>
              ) : null
            )
          )}
        </div>
      </main>
    </>
  );
}
