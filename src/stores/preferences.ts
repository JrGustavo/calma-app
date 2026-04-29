'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

export type ContrastMode = 'soft' | 'medium' | 'high';
export type FontScale = 1.0 | 1.15 | 1.3 | 1.5;
export type AudioSpeed = 0.5 | 0.75 | 1.0 | 1.25;

interface PreferencesState {
  fontScale: FontScale;
  contrast: ContrastMode;
  audioSpeed: AudioSpeed;
  reduceMotion: boolean;
  hydrated: boolean;

  setFontScale: (scale: FontScale) => void;
  setContrast: (mode: ContrastMode) => void;
  setAudioSpeed: (speed: AudioSpeed) => void;
  setReduceMotion: (reduce: boolean) => void;
  reset: () => void;

  hydrateFromServer: (userId: string) => Promise<void>;
}

const DEFAULTS = {
  fontScale: 1.0 as FontScale,
  contrast: 'soft' as ContrastMode,
  audioSpeed: 1.0 as AudioSpeed,
  reduceMotion: false,
};

// ────────────────────────────────────────────────────────────
// Debounce para evitar hammering a Supabase en sliders

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
let currentUserId: string | null = null;

async function debouncedSync(
  userId: string,
  preferences: Record<string, unknown>
) {
  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', userId);

    if (error) {
      console.error('Error sincronizando preferencias:', error);
    }
  }, 500);
}

/**
 * Preferences store.
 *
 * Decisión arquitectónica acordada en Phase 2: Supabase es la fuente única.
 * - Sin sesión: usa defaults locales (no se sincroniza).
 * - Con sesión: hydrateFromServer() sobrescribe el local con el servidor.
 * - Cada cambio se debouncea 500ms y se persiste a Supabase.
 *
 * El persist middleware sigue activo para preservar valores entre recargas
 * mientras se completa la hidratación inicial — evita un "flash" de valores
 * por defecto antes de que el servidor responda.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      hydrated: false,

      setFontScale: (scale) => {
        set({ fontScale: scale });
        if (currentUserId) debouncedSync(currentUserId, { font_size_scale: scale });
      },

      setContrast: (mode) => {
        set({ contrast: mode });
        if (currentUserId) debouncedSync(currentUserId, { contrast_mode: mode });
      },

      setAudioSpeed: (speed) => {
        set({ audioSpeed: speed });
        if (currentUserId) debouncedSync(currentUserId, { audio_speed: speed });
      },

      setReduceMotion: (reduce) => {
        set({ reduceMotion: reduce });
        if (currentUserId) debouncedSync(currentUserId, { reduce_motion: reduce });
      },

      reset: () => set({ ...DEFAULTS, hydrated: get().hydrated }),

      hydrateFromServer: async (userId: string) => {
        currentUserId = userId;
        const supabase = createClient();

        const { data, error } = await supabase
          .from('user_preferences')
          .select('font_size_scale, contrast_mode, audio_speed, reduce_motion')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error trayendo preferencias:', error);
          set({ hydrated: true });
          return;
        }

        if (data) {
          set({
            fontScale: Number(data.font_size_scale) as FontScale,
            contrast: data.contrast_mode as ContrastMode,
            audioSpeed: Number(data.audio_speed) as AudioSpeed,
            reduceMotion: data.reduce_motion,
            hydrated: true,
          });
        } else {
          set({ hydrated: true });
        }
      },
    }),
    {
      name: 'calma-preferences',
      partialize: (state) => ({
        fontScale: state.fontScale,
        contrast: state.contrast,
        audioSpeed: state.audioSpeed,
        reduceMotion: state.reduceMotion,
      }),
    }
  )
);
