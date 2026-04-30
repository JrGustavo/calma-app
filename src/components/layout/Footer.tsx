import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

/**
 * Footer global con 3 secciones:
 * 1. Marca y descripción breve
 * 2. Navegación a páginas relevantes
 * 3. Contacto
 */
export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-8 bg-bg-secondary">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Marca */}
          <div>
            <h3 className="text-sm font-bold mb-3 text-text-primary">Calma</h3>
            <p className="text-sm text-text-secondary">
              Aprende inglés con calma. Una experiencia de bajo estímulo
              diseñada para niños con TDAH.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-bold mb-3 text-text-primary">
              Conoce más
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/nosotros"
                  className="text-sm text-text-secondary hover:text-text-primary underline transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-sm text-text-secondary hover:text-text-primary underline transition-colors"
                >
                  Cuéntanos qué piensas
                </Link>
              </li>
              <li>
                <Link
                  href="/mediation-guide"
                  className="text-sm text-text-secondary hover:text-text-primary underline transition-colors"
                >
                  Guía de mediación
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-bold mb-3 text-text-primary">
              Contacto
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              ¿Tienes dudas, sugerencias o quieres llevar Calma a tu aula?
              Estamos aquí para escucharte y mediar nuevas formas de
              aprendizaje.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Mail
                  className="w-4 h-4 mt-0.5 shrink-0 text-text-muted"
                  strokeWidth={1.75}
                />
                <a
                  href="mailto:calma.app@proton.me"
                  className="text-sm text-text-secondary hover:text-text-primary underline transition-colors break-all"
                >
                  calma.app@proton.me
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 shrink-0 text-text-muted"
                  strokeWidth={1.75}
                />
                <span className="text-sm text-text-secondary">
                  Bogotá, Colombia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-text-muted pt-6 border-t border-border-subtle">
          © {new Date().getFullYear()} Calma · Proyecto vinculado a la
          Universidad El Bosque.
        </p>
      </div>
    </footer>
  );
}
