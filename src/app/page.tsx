import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, dashboardPathForRole } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardHref: string | null = null;
  if (user) {
    const role = await getUserRole(supabase, user.id);
    dashboardHref = dashboardPathForRole(role);
  }

  return (
    <>
      <CognitiveBatteryPanel />
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-prose text-center">
          <h1 className="text-3xl font-bold mb-6">Calma</h1>
          <p className="text-lg text-text-secondary mb-3">
            Aprende inglés con calma.
          </p>
          <p className="text-base text-text-muted mb-10 max-w-prose mx-auto">
            Una aplicación de bajo estímulo diseñada para acompañar a niños con
            TDAH en el aprendizaje del inglés. Lecciones cortas, descansos
            visuales y herramientas para regular tu propio ritmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {dashboardHref ? (
              <Link href={dashboardHref}>
                <Button size="lg">Ir a mi panel</Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg">Crear cuenta</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary">
                    Iniciar sesión
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
