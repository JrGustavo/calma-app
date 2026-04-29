import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';

export default async function TeacherDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getUserProfile(supabase, user.id);

  // Contar estudiantes en sus aulas
  const { count: studentCount } = await supabase
    .from('classroom_memberships')
    .select('*', { count: 'exact', head: true })
    .eq('teacher_id', user.id);

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
                {profile?.display_name ?? 'Docente'}
              </h1>
              <p className="text-text-secondary mt-2">
                {studentCount ?? 0} estudiantes asignados
              </p>
            </div>
            <LogoutButton />
          </header>

          <Card variant="elevated">
            <h2 className="text-lg font-bold mb-2">Mis estudiantes</h2>
            <p className="text-text-secondary mb-4">
              La lista de estudiantes y su progreso aparecerán aquí.
            </p>
            <p className="text-sm text-text-muted">
              Esta sección se completa en la Fase 4 — Módulo del docente.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-2">Lecciones</h2>
            <p className="text-text-secondary">
              Aquí podrás crear y gestionar lecciones por nivel del MCER.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
