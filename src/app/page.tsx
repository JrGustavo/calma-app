import Link from 'next/link';
import Image from 'next/image';
import { Cloud, Clock, Award, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, dashboardPathForRole } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { TextToSpeech } from '@/components/lesson/TextToSpeech';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const PAGE_TEXT =
  'Calma. Aprende inglés con calma. Una aplicación de bajo estímulo diseñada para acompañar a niños con TDAH. Lecciones cortas, descansos visuales y herramientas para regular tu propio ritmo.';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dashboardHref: string | null = null;
  if (user) {
    const role = await getUserRole(supabase, user.id);
    dashboardHref = dashboardPathForRole(role);
  }

  return (
    <>
      <CognitiveBatteryPanel />

      <main>
        {/* HERO */}
        <section className="px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.jpg"
                alt="Logo de Calma"
                width={1216}
                height={877}
                priority
                className="w-48 sm:w-64 md:w-72 h-auto rounded-lg"
              />
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Calma
              </h1>
              <TextToSpeech
                text={PAGE_TEXT}
                lang="es-CO"
                size="md"
                ariaLabel="Escuchar el contenido de esta página"
              />
            </div>

            <p className="text-lg sm:text-xl text-text-secondary mb-8">
              Aprende inglés con calma.
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
        </section>

        {/* 3 PASOS */}
        <section className="px-6 py-16 bg-bg-secondary border-y border-border-subtle">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Tres pasos, a tu ritmo
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-bg-alt flex items-center justify-center">
                    <Cloud className="w-8 h-8 text-text-secondary" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-sm text-text-muted text-center mb-1">Paso 1</p>
                <h3 className="font-bold text-center mb-2">Respira</h3>
                <p className="text-sm text-text-secondary text-center">
                  Empezamos con calma. Sin prisas, sin saturación.
                </p>
              </Card>

              <Card>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-bg-alt flex items-center justify-center">
                    <Clock className="w-8 h-8 text-text-secondary" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-sm text-text-muted text-center mb-1">Paso 2</p>
                <h3 className="font-bold text-center mb-2">Micro-misiones</h3>
                <p className="text-sm text-text-secondary text-center">
                  Tareas cortas que se sienten posibles.
                </p>
              </Card>

              <Card>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-bg-alt flex items-center justify-center">
                    <Award className="w-8 h-8 text-text-secondary" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-sm text-text-muted text-center mb-1">Paso 3</p>
                <h3 className="font-bold text-center mb-2">Gana logros</h3>
                <p className="text-sm text-text-secondary text-center">
                  Cada paso completado es un avance real.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA SECUNDARIO */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              ¿Eres docente o familia?
            </h2>
            <p className="text-text-secondary mb-8 max-w-prose mx-auto">
              Calma incluye herramientas para acompañar el aprendizaje desde
              el aula y desde casa, con respeto por los ritmos cognitivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
              <Link href="/zona-padres">
                <Button>
                  <Shield className="w-4 h-4" />
                  Zona para Padres
                </Button>
              </Link>
              <Link href="/mediation-guide">
                <Button variant="secondary">Guía de mediación</Button>
              </Link>
              <Link href="/nosotros">
                <Button variant="ghost">Conoce al equipo</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
