'use client';

import { useEffect, useState } from 'react';
import { usePreferences } from '@/stores/preferences';

interface ConfettiBurstProps {
  trigger: boolean;
  onDone?: () => void;
}

/**
 * Pequeño burst de confeti tras una respuesta correcta.
 * Respeta reduce-motion: si está activo, no se muestra.
 * También reproduce un "pop" suave si el navegador lo permite.
 */
export function ConfettiBurst({ trigger, onDone }: ConfettiBurstProps) {
  const reduceMotion = usePreferences((s) => s.reduceMotion);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; rotate: number; color: string }>
  >([]);

  useEffect(() => {
    if (!trigger || reduceMotion) {
      if (trigger && onDone) onDone();
      return;
    }

    // Generar partículas en colores neutros del sistema
    const colors = ['#6B8E6F', '#B8860B', '#5A5A5A', '#C4BFB4'];
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 50,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);

    // Pop sound suave (frecuencia baja)
    try {
      type AudioCtxCtor = new () => AudioContext;
      const w = window as unknown as {
        AudioContext?: AudioCtxCtor;
        webkitAudioContext?: AudioCtxCtor;
      };
      const Ctor = w.AudioContext ?? w.webkitAudioContext;
      if (Ctor) {
        const ctx = new Ctor();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 320;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Silencio si el navegador bloquea audio
    }

    const t = setTimeout(() => {
      setParticles([]);
      onDone?.();
    }, 1500);

    return () => clearTimeout(t);
  }, [trigger, reduceMotion, onDone]);

  if (particles.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
