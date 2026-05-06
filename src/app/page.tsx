import Link from 'next/link';
import Image from 'next/image';
import { Cloud, Clock, Award, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, dashboardPathForRole } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { LandingBackground } from '@/components/layout/LandingBackground';
import { TextToSpeech } from '@/components/lesson/TextToSpeech';
import { Button } from '@/components/ui/Button';

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

      <main className="relative landing-bg overflow-hidden">
        <LandingBackground />

        {/* HERO */}
        <section className="relative px-6 pt-12 pb-12 sm:pt-20 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-bg-elevated/70 backdrop-blur-sm border border-border-subtle shadow-soft animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent-terracotta" strokeWidth={2} />
              <span className="text-xs font-medium text-text-secondary tracking-wide">
                Educación neuroinclusiva
              </span>
            </div>

            <div className="flex justify-center mb-8 animate-soft-float">
              <Image
                src="/logo.jpg"
                alt="Logo de Calma"
                width={1216}
                height={877}
                priority
                className="w-44 sm:w-60 md:w-72 h-auto rounded-3xl shadow-warm"
              />
            </div>

            <div
              className="flex items-center justify-center gap-3 mb-5 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight text-grammar">
                Calma
              </h1>
              <TextToSpeech
                text={PAGE_TEXT}
                lang="es-CO"
                size="md"
                ariaLabel="Escuchar el contenido de esta página"
              />
            </div>

            <p
              className="font-display text-xl sm:text-2xl md:text-3xl text-text-primary font-medium mb-3 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Aprende inglés <em className="text-grammar">con calma.</em>
            </p>
            <p
              className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              Una experiencia diseñada para que cada niño y niña con TDAH
              florezca a su propio ritmo.
            </p>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="relative px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.2em] text-accent-terracotta font-bold mb-3">
                Tres pasos
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold">
                Cómo Funciona
              </h2>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <MissionCard
                number={1}
                title="Pausas de Enfoque"
                description="Respira y prepárate antes de cada misión."
                caption="Interactividad para evitar impulsividad."
                icon={<Cloud className="w-12 h-12" strokeWidth={1.5} />}
                accent="sage"
                delay="0.1s"
              />
              <MissionCard
                number={2}
                title="Lecciones Cortas"
                description="Misión de hoy: 3 bloques de 6 min."
                caption="Misiones cortas y posibles."
                icon={<Clock className="w-12 h-12" strokeWidth={1.5} />}
                accent="terracotta"
                delay="0.2s"
              />
              <MissionCard
                number={3}
                title="Gana Logros"
                description="Cada paso completado es un avance real."
                caption="Avanza a tu propio ritmo."
                icon={<Award className="w-12 h-12" strokeWidth={1.5} />}
                accent="rose"
                delay="0.3s"
              />
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="relative px-6 py-12 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Acceso */}
            <div className="bg-bg-elevated/85 backdrop-blur-sm border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-warm flex flex-col gap-3 justify-center">
              <h3 className="font-display text-2xl font-bold mb-1">
                {dashboardHref ? 'Continúa tu camino' : 'Empieza tu camino'}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {dashboardHref
                  ? 'Regresa a tu panel y sigue donde lo dejaste.'
                  : 'Crea tu cuenta o inicia sesión para empezar a aprender.'}
              </p>
              {dashboardHref ? (
                <Link href={dashboardHref}>
                  <Button size="lg" className="w-full">
                    Ir a mi panel <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/signup">
                    <Button size="lg" className="w-full">
                      Crear cuenta
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="secondary" className="w-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Zona Padres */}
            <Link
              href="/zona-padres"
              className="group bg-bg-elevated/85 backdrop-blur-sm border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-warm hover:shadow-soft transition-all hover:bg-bg-warm/80"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-grammar-bg flex items-center justify-center shrink-0 shadow-soft">
                  <Shield className="w-6 h-6 text-grammar" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold mb-1">
                    Zona para Padres y Tutores
                  </h3>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Información de seguridad y privacidad infantil. Contenido validado por especialistas en educación.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-grammar group-hover:gap-2.5 transition-all">
                Conocer más <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Links secundarios */}
          <div className="max-w-5xl mx-auto mt-12 flex flex-wrap gap-x-8 gap-y-3 justify-center">
            <Link
              href="/mediation-guide"
              className="text-sm text-text-secondary hover:text-grammar underline underline-offset-4 transition-colors"
            >
              Guía de mediación
            </Link>
            <Link
              href="/nosotros"
              className="text-sm text-text-secondary hover:text-grammar underline underline-offset-4 transition-colors"
            >
              Conoce al equipo
            </Link>
            <Link
              href="/feedback"
              className="text-sm text-text-secondary hover:text-grammar underline underline-offset-4 transition-colors"
            >
              Cuéntanos qué piensas
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

interface MissionCardProps {
  number: number;
  title: string;
  description: string;
  caption: string;
  icon: React.ReactNode;
  accent: 'sage' | 'terracotta' | 'rose';
  delay: string;
}

function MissionCard({
  number,
  title,
  description,
  caption,
  icon,
  accent,
  delay,
}: MissionCardProps) {
  const accentMap = {
    sage: {
      bg: 'bg-accent-sage-bg',
      text: 'text-accent-sage',
      badgeText: 'text-accent-sage',
      iconBg: 'bg-accent-sage-bg',
      iconText: 'text-accent-sage',
    },
    terracotta: {
      bg: 'bg-accent-terracotta-bg',
      text: 'text-accent-terracotta',
      badgeText: 'text-accent-terracotta',
      iconBg: 'bg-accent-terracotta-bg',
      iconText: 'text-accent-terracotta',
    },
    rose: {
      bg: 'bg-accent-rose-bg',
      text: 'text-accent-rose',
      badgeText: 'text-accent-rose',
      iconBg: 'bg-accent-rose-bg',
      iconText: 'text-accent-rose',
    },
  };
  const c = accentMap[accent];

  return (
    <article
      className="group bg-bg-elevated/90 backdrop-blur-sm border border-border-subtle rounded-3xl p-6 shadow-warm hover:shadow-soft transition-all flex flex-col animate-fade-in"
      style={{ animationDelay: delay }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div
          className={`w-10 h-10 rounded-2xl ${c.bg} flex items-center justify-center shadow-soft`}
        >
          <span className={`text-base font-bold ${c.text}`}>{number}</span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${c.badgeText}`}
        >
          Micro-Misión
        </span>
      </div>

      {/* Icono */}
      <div className="flex justify-center my-4">
        <div
          className={`w-28 h-28 rounded-full ${c.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
        >
          <span className={c.iconText}>{icon}</span>
        </div>
      </div>

      {/* Texto */}
      <div className="border-t border-border-subtle pt-5 text-center">
        <p
          className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-bold ${c.text}`}
        >
          Paso {number}
        </p>
        <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-3 leading-relaxed">
          {description}
        </p>
        <p className="text-xs text-text-muted italic">{caption}</p>
      </div>
    </article>
  );
}
