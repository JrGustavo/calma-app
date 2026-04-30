'use client';

import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusShieldProps {
  /** Se llama cada vez que el estudiante pierde el foco */
  onFocusBreak?: () => void;
  /** Pedir pantalla completa al montar */
  requestFullscreen?: boolean;
  children: React.ReactNode;
}

/**
 * FocusShield (Escudo Escolar)
 *
 * Andamiaje externo para mantener al estudiante enfocado durante una lección.
 *
 * Limitaciones honestas (documentadas en la guía de mediación):
 * - Los navegadores no permiten bloquear Cmd+T, Cmd+W desde una web app.
 * - Lo que sí podemos hacer: detectar cuando el estudiante pierde el foco
 *   (Visibility API), pedir fullscreen, deshabilitar menú contextual,
 *   y avisar al cerrar/recargar.
 */
export function FocusShield({
  onFocusBreak,
  requestFullscreen = true,
  children,
}: FocusShieldProps) {
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const breakCountRef = useRef(0);

  // Pantalla completa al montar
  useEffect(() => {
    if (!requestFullscreen) return;
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {
        // Algunos navegadores requieren gesto del usuario; no hacemos nada.
      });
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [requestFullscreen]);

  // Detectar pérdida de foco
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        breakCountRef.current += 1;
        onFocusBreak?.();
      } else {
        // Volvió → mostrar mensaje
        if (breakCountRef.current > 0) {
          setShowWelcomeBack(true);
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [onFocusBreak]);

  // Avisar antes de cerrar/recargar
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Bloquear menú contextual
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
    }
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Indicador del Modo Enfoque (única excepción permitida del azul petróleo) */}
      <div
        className={cn(
          'fixed top-4 left-4 z-30',
          'inline-flex items-center gap-2',
          'px-3 py-1.5 rounded-full',
          'bg-bg-elevated border border-border'
        )}
      >
        <Lock className="w-4 h-4 text-system-accent" strokeWidth={2} />
        <span className="text-sm font-bold text-system-accent">
          Modo Enfoque Activo
        </span>
      </div>

      {children}

      {/* Modal de bienvenida al volver */}
      {showWelcomeBack && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/30 px-6"
        >
          <div className="w-full max-w-md bg-bg-elevated border border-border rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
            <p className="text-text-secondary mb-6">
              Salimos un momento. ¿Listo para continuar?
            </p>
            <button
              type="button"
              onClick={() => setShowWelcomeBack(false)}
              className="w-full min-h-[52px] px-6 bg-bg-secondary border border-border rounded-md font-medium text-text-primary hover:bg-bg-alt transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
