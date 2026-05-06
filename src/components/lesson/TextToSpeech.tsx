'use client';

import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { usePreferences } from '@/stores/preferences';
import { cn } from '@/lib/utils';

interface TextToSpeechProps {
  text: string;
  lang?: 'en-US' | 'es-CO';
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

/**
 * Botón TTS que usa la Web Speech API del navegador.
 * Respeta la velocidad configurada en el Panel de Batería Cognitiva.
 */
export function TextToSpeech({
  text,
  lang = 'en-US',
  size = 'sm',
  ariaLabel,
}: TextToSpeechProps) {
  const [speaking, setSpeaking] = useState(false);
  const audioSpeed = usePreferences((s) => s.audioSpeed);

  function speak() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = audioSpeed;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={ariaLabel ?? `Escuchar: ${text}`}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-bg-elevated border border-border',
        'hover:bg-bg-secondary transition-colors',
        sizeClass,
        speaking && 'opacity-50'
      )}
    >
      <Volume2 className={iconSize} strokeWidth={1.75} />
    </button>
  );
}
