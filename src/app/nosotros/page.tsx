import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Nosotros — Calma',
  description: 'El equipo detrás de Calma: cuatro miradas, un mismo propósito.',
};

export default function NosotrosPage() {
  return (
    <>
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>

          <header>
            <p className="text-sm text-text-muted mb-2">
              El equipo detrás de Calma
            </p>
            <h1 className="text-3xl font-bold mb-2">
              Cuatro miradas, un mismo propósito.
            </h1>
          </header>

          <Card variant="elevated">
            <h2 className="text-xl font-bold mb-3">¿Quiénes somos?</h2>
            <p className="text-text-primary">
              Somos un equipo interdisciplinar de la Universidad El Bosque,
              integrado por Luisa y Margarita (Licenciadas en Educación
              Infantil) y María Paula y Carolina (Licenciadas en Bilingüismo).
              Unimos nuestra experiencia en el aula y el lenguaje para crear
              un entorno donde el inglés y el bienestar caminen de la mano.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">
              Nuestro propósito pedagógico
            </h2>
            <p className="text-text-primary mb-4">
              Como educadoras, entendemos que el bilingüismo tradicional a
              menudo ignora la salud emocional y los ritmos cognitivos de los
              niños y las niñas. Nuestro propósito es ofrecer un andamiaje
              integral:
            </p>
            <ul className="space-y-3 text-text-primary">
              <li className="flex gap-3">
                <span className="text-text-muted shrink-0">·</span>
                <span>
                  <strong>Desde la Educación Infantil,</strong> garantizamos
                  un entorno de bajo estímulo que respeta el desarrollo
                  socioafectivo.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-text-muted shrink-0">·</span>
                <span>
                  <strong>Desde el Bilingüismo,</strong> mediamos el
                  aprendizaje del inglés de forma natural, eliminando la
                  frustración y la sobrecarga sensorial.
                </span>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">Lo que nos mueve</h2>
            <p className="text-text-primary">
              Creemos que aprender una segunda lengua no debe ser un proceso
              agotador. Calma es nuestra respuesta a la necesidad de una
              educación más humana, donde cada estudiante tenga el espacio y
              el tiempo para florecer a su propio ritmo.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
