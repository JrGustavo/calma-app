'use client';

import { useEffect, useState } from 'react';
import { Settings, X } from 'lucide-react';
import {
  usePreferences,
  type ContrastMode,
  type FontScale,
  type AudioSpeed,
} from '@/stores/preferences';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const FONT_SCALES: { value: FontScale; label: string }[] = [
  { value: 1.0, label: '100%' },
  { value: 1.15, label: '115%' },
  { value: 1.3, label: '130%' },
  { value: 1.5, label: '150%' },
];

const CONTRAST_MODES: { value: ContrastMode; label: string }[] = [
  { value: 'soft', label: 'Suave' },
  { value: 'medium', label: 'Medio' },
  { value: 'high', label: 'Alto' },
];

const AUDIO_SPEEDS: { value: AudioSpeed; label: string }[] = [
  { value: 0.5, label: '0.5×' },
  { value: 0.75, label: '0.75×' },
  { value: 1.0, label: '1×' },
  { value: 1.25, label: '1.25×' },
];

/**
 * CognitiveBatteryPanel
 *
 * Real-time control panel for cognitive accessibility settings.
 * - Font size (4 stops)
 * - Contrast mode (3 stops)
 * - Audio playback speed (4 stops)
 * - Reduce motion toggle
 *
 * All changes apply immediately, no save button.
 * Side effects (DOM attribute and CSS variable updates) are managed here.
 */
export function CognitiveBatteryPanel() {
  const [open, setOpen] = useState(false);
  const {
    fontScale,
    contrast,
    audioSpeed,
    reduceMotion,
    setFontScale,
    setContrast,
    setAudioSpeed,
    setReduceMotion,
  } = usePreferences();

  // Apply font scale to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  // Apply contrast mode
  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast);
  }, [contrast]);

  // Apply reduce motion
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-reduce-motion',
      String(reduceMotion)
    );
  }, [reduceMotion]);

  // ESC closes the drawer
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir panel de configuración de accesibilidad"
        className={cn(
          'fixed top-4 right-4 z-40',
          'inline-flex items-center justify-center',
          'w-12 h-12 rounded-full',
          'bg-bg-elevated border border-border',
          'text-text-primary',
          'hover:bg-bg-secondary',
          'transition-colors duration-200'
        )}
      >
        <Settings className="w-5 h-5" strokeWidth={1.75} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-text-primary/20"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Panel de batería cognitiva"
        aria-modal="true"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-sm z-50',
          'bg-bg-secondary border-l border-border',
          'transition-transform duration-200',
          'flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        )}
      >
        <header className="flex items-center justify-between p-6 border-b border-border-subtle">
          <h2 className="text-xl font-bold">Batería cognitiva</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar panel"
            className="p-2 rounded-md hover:bg-bg-alt"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Font size */}
          <Section
            title="Tamaño de letra"
            description="Aumenta el tamaño si te cuesta leer."
          >
            <SegmentedControl
              options={FONT_SCALES}
              value={fontScale}
              onChange={setFontScale}
              ariaLabel="Tamaño de letra"
            />
          </Section>

          {/* Contrast */}
          <Section
            title="Contraste"
            description="Si los colores se ven muy claros, sube el contraste."
          >
            <SegmentedControl
              options={CONTRAST_MODES}
              value={contrast}
              onChange={setContrast}
              ariaLabel="Modo de contraste"
            />
          </Section>

          {/* Audio speed */}
          <Section
            title="Velocidad del audio"
            description="Reduce la velocidad si necesitas más tiempo para entender."
          >
            <SegmentedControl
              options={AUDIO_SPEEDS}
              value={audioSpeed}
              onChange={setAudioSpeed}
              ariaLabel="Velocidad de reproducción de audio"
            />
          </Section>

          {/* Reduce motion */}
          <Section
            title="Reducir movimiento"
            description="Desactiva las transiciones y animaciones."
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                className="w-5 h-5 accent-text-primary cursor-pointer"
              />
              <span className="text-text-primary">
                {reduceMotion ? 'Activado' : 'Desactivado'}
              </span>
            </label>
          </Section>
        </div>

        <footer className="p-6 border-t border-border-subtle">
          <Button variant="secondary" onClick={() => setOpen(false)} className="w-full">
            Listo
          </Button>
        </footer>
      </aside>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Internal helpers

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-base font-bold mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-3">{description}</p>
      {children}
    </section>
  );
}

interface SegmentedControlProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-cols-4 gap-1 p-1 bg-bg-alt rounded-md border border-border-subtle"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={String(option.value)}
            role="radio"
            aria-checked={isActive}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-[44px] px-2 rounded text-sm font-medium',
              'transition-colors duration-200',
              isActive
                ? 'bg-bg-elevated border border-border text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
