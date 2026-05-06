'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { usePreferences } from '@/stores/preferences';

interface BreathingPauseProps {
  onContinue: () => void;
  /** Duración mínima antes de poder continuar (ms). Default: 16s = 2 ciclos */
  minDurationMs?: number;
}

/**
 * Pausa de respiración entre tareas.
 * - SVG animado: círculo que se expande (4s inhalar) y contrae (4s exhalar)
 * - Botón Continuar bloqueado hasta completar 2 ciclos (16s)
 * - Si reduce-motion está activo: sin animación, espera completa antes de habilitar
 */
export function BreathingPause({
  onContinue,
  minDurationMs = 16000,
}: BreathingPauseProps) {
  const reduceMotion = usePreferences((s) => s.reduceMotion);
  const [unlocked, setUnlocked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(minDurationMs / 1000)
  );

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, Math.ceil((minDurationMs - elapsed) / 1000));
      setSecondsLeft(remaining);
      if (elapsed >= minDurationMs) {
        setUnlocked(true);
        clearInterval(interval);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [minDurationMs]);

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-lg p-8 text-center">
      <p className="text-text-secondary mb-2">Respira un momento.</p>
      <p className="text-sm text-text-muted mb-6">
        Inhala mientras crece, exhala mientras se reduce.
      </p>

      {!reduceMotion ? (
        <div className="flex justify-center mb-6">
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            <circle
              cx="80"
              cy="80"
              r="30"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="2"
              className="animate-breathing"
              style={{ transformOrigin: 'center' }}
            />
            <circle
              cx="80"
              cy="80"
              r="30"
              fill="var(--bg-elevated)"
              className="animate-breathing"
              style={{ transformOrigin: 'center', opacity: 0.5 }}
            />
          </svg>
        </div>
      ) : (
        <div className="mb-6 text-4xl font-bold text-text-secondary">
          {secondsLeft}
        </div>
      )}

      {unlocked ? (
        <Button onClick={onContinue}>Continuar</Button>
      ) : (
        <p className="text-sm text-text-muted">
          {secondsLeft > 0
            ? `Continuamos en ${secondsLeft}s...`
            : 'Listo'}
        </p>
      )}
    </div>
  );
}
