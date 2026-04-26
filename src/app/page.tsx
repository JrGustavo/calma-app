import Link from 'next/link';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
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
            <Link href="/showcase">
              <Button size="lg">Ver el sistema de diseño</Button>
            </Link>
          </div>

          <p className="mt-12 text-sm text-text-muted">
            Fase 1 — Sistema de diseño · Próxima fase: backend y autenticación
          </p>
        </div>
      </main>
    </>
  );
}
