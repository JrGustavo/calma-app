import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';

export default async function ParentDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getUserProfile(supabase, user.id);

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
                {profile?.display_name ?? 'Familia'}
              </h1>
              <p className="text-text-secondary mt-2">
                Acompañas el aprendizaje de tu hijo o hija.
              </p>
            </div>
            <LogoutButton />
          </header>

          <Card variant="elevated">
            <h2 className="text-lg font-bold mb-2">Tus hijos</h2>
            <p className="text-text-secondary mb-4">
              Aquí verás el progreso de los estudiantes que acompañas.
            </p>
            <p className="text-sm text-text-muted">
              Necesitas vincular un estudiante a tu cuenta. Esta función llega
              en la Fase 4.
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-2">Guía de mediación</h2>
            <p className="text-text-secondary">
              Recursos para acompañar el aprendizaje en casa estarán aquí.
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
