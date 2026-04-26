import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { GrammarMarker } from '@/components/lesson/GrammarMarker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ShowcasePage() {
  return (
    <>
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-12">
          {/* Header */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
            <h1 className="text-3xl font-bold mb-3">Sistema de diseño</h1>
            <p className="text-text-secondary">
              Esta página permite validar visualmente cada componente del
              sistema. Abre el panel de configuración (arriba a la derecha)
              para probar tamaño de fuente, contraste y reducción de movimiento
              en tiempo real.
            </p>
          </div>

          {/* Color palette */}
          <Section title="Paleta de colores" subtitle="Tonos crema y grises neutros. Sin blanco puro.">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Swatch name="bg-primary" hex="#F5F1E8" />
              <Swatch name="bg-secondary" hex="#ECE8DD" />
              <Swatch name="bg-alt" hex="#E8E8E5" />
              <Swatch name="bg-elevated" hex="#EFEAE0" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <Swatch name="text-primary" hex="#2C2C2C" dark />
              <Swatch name="text-secondary" hex="#5A5A5A" dark />
              <Swatch name="text-muted" hex="#7A7A7A" dark />
              <Swatch name="border" hex="#C4BFB4" />
            </div>
          </Section>

          {/* Petroleum blue — reserved use */}
          <Section
            title="Azul petróleo — uso reservado"
            subtitle="Único color con saturación, exclusivo para marcadores gramaticales y el indicador del Modo Enfoque."
          >
            <Card>
              <p className="text-base">
                Mira esta frase: She{' '}
                <GrammarMarker
                  type="auxiliary"
                  hint="Verbo auxiliar 'to be' en presente, tercera persona del singular. Forma parte del presente continuo."
                >
                  is
                </GrammarMarker>{' '}
                <GrammarMarker type="verb-tense" hint="Verbo en gerundio (-ing). Indica una acción en curso.">
                  going
                </GrammarMarker>{' '}
                to school. Toca cualquier marcador para ver la explicación.
              </p>
            </Card>

            <Card className="mt-3">
              <p className="text-base">
                Otra frase con preposición:{' '}
                <GrammarMarker type="pronoun">I</GrammarMarker> live{' '}
                <GrammarMarker
                  type="preposition"
                  hint="Preposición de lugar. 'In' se usa para ciudades, países y espacios cerrados."
                >
                  in
                </GrammarMarker>{' '}
                Bogotá <GrammarMarker type="preposition">with</GrammarMarker>{' '}
                my family.
              </p>
            </Card>

            <p className="text-sm text-text-muted mt-3">
              El azul petróleo no se usa en botones, encabezados ni navegación.
            </p>
          </Section>

          {/* Buttons */}
          <Section title="Botones" subtitle="Sin colores brillantes. Bordes sutiles, fondos neutros.">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Continuar</Button>
              <Button variant="secondary">Cancelar</Button>
              <Button variant="ghost">Saltar</Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <Button size="lg">Empezar lección</Button>
              <Button size="lg" variant="secondary">
                Volver
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <Button disabled>Deshabilitado</Button>
            </div>
          </Section>

          {/* Cards */}
          <Section title="Tarjetas">
            <div className="space-y-3">
              <Card>
                <h3 className="text-lg font-bold mb-2">Tarjeta normal</h3>
                <p className="text-text-secondary">
                  Fondo crema secundario, borde sutil. Usada para agrupar
                  contenido relacionado.
                </p>
              </Card>
              <Card variant="elevated">
                <h3 className="text-lg font-bold mb-2">Tarjeta elevada</h3>
                <p className="text-text-secondary">
                  Para contenido que requiere algo de jerarquía visual sin
                  recurrir a colores fuertes.
                </p>
              </Card>
            </div>
          </Section>

          {/* Focus mode preview */}
          <Section
            title="Indicador de Modo Enfoque"
            subtitle="Excepción permitida del azul petróleo: indica que el escudo escolar está activo."
          >
            <Card variant="elevated">
              <div className="flex items-center gap-2 text-system-accent">
                <Lock className="w-4 h-4" strokeWidth={2} />
                <span className="text-sm font-bold">Modo Enfoque Activo</span>
              </div>
              <p className="text-text-secondary text-sm mt-3">
                Durante una lección, este indicador permanece visible y la
                aplicación bloquea (en la medida que el navegador lo permite)
                el acceso a otras pestañas o ventanas.
              </p>
            </Card>
          </Section>

          {/* Typography */}
          <Section title="Tipografía" subtitle="Atkinson Hyperlegible, diseñada para baja visión y carga cognitiva.">
            <Card>
              <h1 className="text-3xl font-bold mb-2">Encabezado nivel 1</h1>
              <h2 className="text-2xl font-bold mb-2">Encabezado nivel 2</h2>
              <h3 className="text-xl font-bold mb-3">Encabezado nivel 3</h3>
              <p className="text-base mb-3">
                Texto base a 18 píxeles con interlineado generoso. Las líneas
                no superan 65 caracteres para evitar saturación visual al leer.
              </p>
              <p className="text-sm text-text-secondary">
                Texto secundario, usado para descripciones y notas.
              </p>
            </Card>
          </Section>
        </div>
      </main>
    </>
  );
}

// ────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      {subtitle && <p className="text-text-secondary mb-4">{subtitle}</p>}
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  dark = false,
}: {
  name: string;
  hex: string;
  dark?: boolean;
}) {
  return (
    <div className="rounded-md border border-border-subtle overflow-hidden">
      <div
        style={{ backgroundColor: hex }}
        className="h-16 w-full flex items-end p-2"
      >
        <code
          className={`text-xs font-mono ${dark ? 'text-bg-primary' : 'text-text-primary'}`}
        >
          {hex}
        </code>
      </div>
      <div className="px-2 py-2 bg-bg-secondary">
        <code className="text-xs font-mono text-text-secondary">{name}</code>
      </div>
    </div>
  );
}
