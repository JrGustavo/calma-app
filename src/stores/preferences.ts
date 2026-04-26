'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContrastMode = 'soft' | 'medium' | 'high';
export type FontScale = 1.0 | 1.15 | 1.3 | 1.5;
export type AudioSpeed = 0.5 | 0.75 | 1.0 | 1.25;

interface PreferencesState {
  fontScale: FontScale;
  contrast: ContrastMode;
  audioSpeed: AudioSpeed;
  reduceMotion: boolean;

  setFontScale: (scale: FontScale) => void;
  setContrast: (mode: ContrastMode) => void;
  setAudioSpeed: (speed: AudioSpeed) => void;
  setReduceMotion: (reduce: boolean) => void;
  reset: () => void;
}

const DEFAULTS = {
  fontScale: 1.0 as FontScale,
  contrast: 'soft' as ContrastMode,
  audioSpeed: 1.0 as AudioSpeed,
  reduceMotion: false,
};

/**
 * Preferences store — Cognitive Battery Panel state.
 *
 * Persists to localStorage for now (Phase 1).
 * In Phase 2, will sync to Supabase user_preferences table.
 *
 * Side effects (DOM updates) happen in CognitiveBatteryPanel via useEffect,
 * so this store stays pure.
 */
export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setFontScale: (scale) => set({ fontScale: scale }),
      setContrast: (mode) => set({ contrast: mode }),
      setAudioSpeed: (speed) => set({ audioSpeed: speed }),
      setReduceMotion: (reduce) => set({ reduceMotion: reduce }),
      reset: () => set(DEFAULTS),
    }),
    {
      name: 'calma-preferences',
    }
  )
);
