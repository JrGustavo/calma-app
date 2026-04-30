import Link from 'next/link';

/**
 * Footer global. Se incluye en la landing y en otras páginas públicas.
 * No se incluye dentro de lecciones (FocusShield) para no distraer.
 */
export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-16">
      <div className="max-w-prose mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold mb-3 text-text-primary">Calma</h3>
            <p className="text-sm text-text-secondary">
              Aprende inglés con calma. Una experiencia de bajo estímulo
              diseñada para niños con TDAH.
            </p>
          </div>

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
        </div>

        <p className="text-xs text-text-muted pt-6 border-t border-border-subtle">
          © {new Date().getFullYear()} Calma · Universidad El Bosque
        </p>
      </div>
    </footer>
  );
}
