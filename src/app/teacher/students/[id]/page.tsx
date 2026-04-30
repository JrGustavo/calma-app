import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';

interface ProgressRow {
  id: string;
  task_id: string;
  completed_at: string;
  time_spent_seconds: number;
  success: boolean;
}

interface SessionRow {
  id: string;
  started_at: string;
  ended_at: string | null;
  focus_breaks: number;
  lesson_id: string | null;
}

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verificar que este estudiante está en el aula del docente
  const { data: membership } = await supabase
    .from('classroom_memberships')
    .select('id')
    .eq('teacher_id', user.id)
    .eq('student_id', studentId)
    .maybeSingle();

  if (!membership) notFound();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('display_name, cefr_level')
    .eq('id', studentId)
    .single();
  const profile = profileData as { display_name: string; cefr_level: string } | null;

  const { data: progressData } = await supabase
    .from('student_progress')
    .select('id, task_id, completed_at, time_spent_seconds, success')
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false })
    .limit(20);
  const progress = (progressData ?? []) as ProgressRow[];

  const { data: sessionsData } = await supabase
    .from('session_logs')
    .select('id, started_at, ended_at, focus_breaks, lesson_id')
    .eq('student_id', studentId)
    .order('started_at', { ascending: false })
    .limit(10);
  const sessions = (sessionsData ?? []) as SessionRow[];

  const totalCompleted = progress.length;
  const totalSuccess = progress.filter((p) => p.success).length;
  const successRate = totalCompleted > 0
    ? Math.round((totalSuccess / totalCompleted) * 100)
    : 0;
  const avgTime = totalCompleted > 0
    ? Math.round(
        progress.reduce((acc, p) => acc + p.time_spent_seconds, 0) / totalCompleted
      )
    : 0;

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

          <header>
            <h1 className="text-3xl font-bold mb-2">
              {profile?.display_name ?? 'Estudiante'}
            </h1>
            <p className="text-text-secondary">Nivel {profile?.cefr_level ?? 'A1'}</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <p className="text-sm text-text-muted">Tareas completadas</p>
              <p className="text-2xl font-bold">{totalCompleted}</p>
            </Card>
            <Card>
              <p className="text-sm text-text-muted">Tasa de éxito</p>
              <p className="text-2xl font-bold">{successRate}%</p>
            </Card>
            <Card>
              <p className="text-sm text-text-muted">Tiempo promedio</p>
              <p className="text-2xl font-bold">{avgTime}s</p>
            </Card>
          </div>

          <Card>
            <h2 className="text-lg font-bold mb-3">Sesiones recientes</h2>
            {sessions.length === 0 ? (
              <p className="text-text-secondary">Sin sesiones aún.</p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {sessions.map((s) => (
                  <li key={s.id} className="py-3">
                    <div className="flex justify-between gap-3 flex-wrap">
                      <p className="text-sm">
                        {new Date(s.started_at).toLocaleString('es-CO')}
                      </p>
                      <p className="text-sm text-text-muted">
                        {s.focus_breaks} pérdidas de foco
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-3">Últimas tareas</h2>
            {progress.length === 0 ? (
              <p className="text-text-secondary">Sin progreso aún.</p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {progress.map((p) => (
                  <li key={p.id} className="py-3 flex justify-between gap-3 flex-wrap">
                    <p className="text-sm">
                      {new Date(p.completed_at).toLocaleString('es-CO')}
                    </p>
                    <div className="flex gap-3 text-sm text-text-muted">
                      <span>{p.time_spent_seconds}s</span>
                      <span className={p.success ? 'text-success-muted' : 'text-warning-muted'}>
                        {p.success ? '✓' : '○'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
