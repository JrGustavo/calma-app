import Link from 'next/link';
import Image from 'next/image';
import { Brain, Heart, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, dashboardPathForRole } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

      <main>
        {/* HERO */}
        <section className="px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.jpg"
                alt="Logo de Calma: cerebro estilizado con un libro abierto"
                width={1216}
                height={877}
                priority
                className="w-48 sm:w-64 md:w-72 h-auto rounded-lg"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              Calma
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-6">
              Aprende inglés con calma.
            </p>
            <p className="text-base sm:text-lg text-text-muted mb-10 max-w-xl mx-auto">
              Una aplicación de bajo estímulo diseñada para acompañar a niños
              con TDAH en el aprendizaje del inglés. Lecciones cortas,
              descansos visuales y herramientas para regular tu propio ritmo.
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

        {/* PROPUESTA DE VALOR — 3 PILARES */}
        <section className="px-6 py-16 bg-bg-secondary border-y border-border-subtle">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Pensado para cada ritmo
              </h2>
              <p className="text-text-secondary max-w-prose mx-auto">
                Calma es un puente entre la educación infantil y el bilingüismo,
                diseñado con respeto por la neurodiversidad.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <Brain
                  className="w-8 h-8 text-text-secondary mb-3"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold mb-2">Bajo estímulo visual</h3>
                <p className="text-sm text-text-secondary">
                  Sin colores estridentes, sin animaciones distractoras. Solo
                  lo necesario para aprender.
                </p>
              </Card>
              <Card>
                <Heart
                  className="w-8 h-8 text-text-secondary mb-3"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold mb-2">Andamiaje cognitivo</h3>
                <p className="text-sm text-text-secondary">
                  Ajusta el tamaño de letra, contraste y velocidad de audio
                  según tu energía del momento.
                </p>
              </Card>
              <Card>
                <Sparkles
                  className="w-8 h-8 text-text-secondary mb-3"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold mb-2">Micro-lecciones</h3>
                <p className="text-sm text-text-secondary">
                  Tareas cortas con feedback inmediato. Cada paso es un logro.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA SECUNDARIO — APRENDER MÁS */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              ¿Eres docente o familia?
            </h2>
            <p className="text-text-secondary mb-8 max-w-prose mx-auto">
              Calma incluye herramientas para acompañar el aprendizaje desde
              el aula y desde casa, con respeto por los ritmos cognitivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
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
