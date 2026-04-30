'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
type Level = (typeof LEVELS)[number];

interface LevelSelectorProps {
  userId: string;
  currentLevel: string;
}

/**
 * Dropdown para que el estudiante cambie su nivel CEFR.
 * Actualiza profile.cefr_level y refresca la página para que el
 * dashboard muestre las lecciones del nuevo nivel.
 */
export function LevelSelector({ userId, currentLevel }: LevelSelectorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Level>(
    LEVELS.includes(currentLevel as Level) ? (currentLevel as Level) : 'A1'
  );

  async function save() {
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ cefr_level: selected })
      .eq('id', userId);

    if (error) {
      console.error('Error actualizando nivel:', error);
      return;
    }

    setEditing(false);
    startTransition(() => router.refresh());
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm text-text-secondary hover:text-text-primary underline transition-colors"
      >
        Cambiar nivel
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value as Level)}
        className="min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
        aria-label="Selecciona tu nivel"
      >
        {LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>
            {lvl}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Button onClick={save} disabled={pending}>
          {pending ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setEditing(false);
            setSelected(currentLevel as Level);
          }}
          disabled={pending}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
