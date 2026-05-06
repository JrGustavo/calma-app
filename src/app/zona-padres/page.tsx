import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Zona para Padres — Calma',
  description: 'Políticas de privacidad infantil y restricciones legales.',
};

export default function ZonaPadresPage() {
  return (
    <>
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>

          <header>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-8 h-8 text-text-secondary" strokeWidth={1.5} />
              <h1 className="text-3xl font-bold">Zona para Padres</h1>
            </div>
            <p className="text-text-secondary">
              Información clara sobre cómo protegemos a tus hijos en Calma.
            </p>
          </header>

          <Card variant="elevated">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-6 h-6 mt-1 shrink-0 text-text-secondary" strokeWidth={1.5} />
              <h2 className="text-xl font-bold">Privacidad de los menores</h2>
            </div>
            <p className="mb-3">
              Calma cumple con principios de privacidad infantil inspirados en
              COPPA (EE. UU.) y el RGPD-K (UE):
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>No recopilamos datos sensibles</strong> de los menores
                más allá del nombre que ellos elijan mostrar.
              </li>
              <li>
                <strong>No mostramos publicidad</strong> dentro de la
                aplicación.
              </li>
              <li>
                <strong>No compartimos información</strong> con terceros
                comerciales.
              </li>
              <li>
                <strong>No usamos cookies de seguimiento</strong> ni pixeles
                de redes sociales.
              </li>
            </ul>
          </Card>

          <Card>
            <div className="flex items-start gap-3 mb-3">
              <Eye className="w-6 h-6 mt-1 shrink-0 text-text-secondary" strokeWidth={1.5} />
              <h2 className="text-xl font-bold">Qué información guardamos</h2>
            </div>
            <p className="mb-3">
              Para que la app funcione, almacenamos:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Correo electrónico (para iniciar sesión)</li>
              <li>Nombre que el usuario eligió mostrar</li>
              <li>Nivel de inglés actual (A1, A2, B1, B2)</li>
              <li>
                Progreso en las lecciones (cuáles ha completado, tiempo
                empleado)
              </li>
              <li>
                Preferencias de accesibilidad (tamaño de letra, contraste,
                velocidad de audio)
              </li>
              <li>
                Sesiones de aprendizaje y cantidad de veces que pierde el
                foco (para el Modo Enfoque)
              </li>
            </ul>
            <p className="mt-3 text-sm text-text-secondary">
              Toda la información se guarda con cifrado en reposo y en
              tránsito (HTTPS).
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">Tus derechos</h2>
            <p className="mb-3">Como padre, madre o tutor legal puedes:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                Solicitar acceso a todos los datos del menor escribiendo a{' '}
                <a
                  href="mailto:calma.app@proton.me"
                  className="underline text-text-primary"
                >
                  calma.app@proton.me
                </a>
              </li>
              <li>Pedir la eliminación completa de la cuenta y sus datos</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Exportar el historial de aprendizaje del menor</li>
            </ul>
            <p className="mt-3 text-sm text-text-secondary">
              Atendemos solicitudes en un plazo máximo de 30 días.
            </p>
          </Card>

          <Card>
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-6 h-6 mt-1 shrink-0 text-text-secondary" strokeWidth={1.5} />
              <h2 className="text-xl font-bold">Restricciones de uso</h2>
            </div>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                Calma está diseñado para niños de <strong>8 a 12 años</strong>.
                Para menores de 8 se requiere acompañamiento permanente.
              </li>
              <li>
                Para menores de 13 años, recomendamos que la cuenta sea
                creada y administrada por un adulto.
              </li>
              <li>
                No recomendamos sesiones mayores a <strong>15 minutos</strong>{' '}
                seguidos.
              </li>
              <li>
              El &ldquo;Modo Enfoque&rdquo; es un andamiaje
                Para bloqueo total de pestañas/apps, considera software
                especializado.
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">Vínculo institucional</h2>
            <p className="mb-3">
              Calma es un proyecto vinculado a la <strong>Universidad El
              Bosque</strong> (Bogotá, Colombia), desarrollado por un equipo
              interdisciplinar de Educación Infantil y Bilingüismo.
            </p>
            <p className="text-sm text-text-secondary">
              Esta versión se encuentra en fase de validación con usuarios
              reales. Tu feedback nos ayuda a mejorar.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-3">Contacto</h2>
            <p>
              Para cualquier duda sobre privacidad, derechos del menor o
              uso responsable, escríbenos a{' '}
              <a
                href="mailto:calma.app@proton.me"
                className="underline text-text-primary"
              >
                calma.app@proton.me
              </a>
              .
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
