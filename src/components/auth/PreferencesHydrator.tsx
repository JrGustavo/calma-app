'use client';

import { useEffect } from 'react';
import { usePreferences } from '@/stores/preferences';

interface PreferencesHydratorProps {
  userId: string;
}

/**
 * Hidrata el store de preferencias desde Supabase al montar.
 *
 * Se renderiza dentro del layout de cada zona protegida (student/teacher/parent).
 * Tras montar, las preferencias del servidor sobrescriben las locales.
 */
export function PreferencesHydrator({ userId }: PreferencesHydratorProps) {
  const hydrateFromServer = usePreferences((s) => s.hydrateFromServer);

  useEffect(() => {
    hydrateFromServer(userId);
  }, [userId, hydrateFromServer]);

  return null;
}
