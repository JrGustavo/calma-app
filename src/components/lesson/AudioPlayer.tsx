'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { usePreferences } from '@/stores/preferences';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  src: string;
  label?: string;
}

/**
 * AudioPlayer
 *
 * Reproduce audio respetando la velocidad configurada en el Panel de
 * Batería Cognitiva (0.5x — 1.25x). Sin auto-play, sin loop.
 */
export function AudioPlayer({ src, label = 'Audio' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioSpeed = usePreferences((s) => s.audioSpeed);

  // Aplicar velocidad cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.playbackRate = audioSpeed;
      el.play().catch(() => {});
    }
  }

  function restart() {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.playbackRate = audioSpeed;
    el.play().catch(() => {});
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-bg-elevated border border-border rounded-md">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? 'Pausar' : 'Reproducir'}
        className={cn(
          'inline-flex items-center justify-center',
          'w-12 h-12 rounded-full',
          'bg-bg-secondary border border-border',
          'hover:bg-bg-alt transition-colors'
        )}
      >
        {playing ? (
          <Pause className="w-5 h-5" strokeWidth={2} />
        ) : (
          <Play className="w-5 h-5 ml-0.5" strokeWidth={2} />
        )}
      </button>
      <button
        type="button"
        onClick={restart}
        aria-label="Volver a empezar"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-bg-alt transition-colors"
      >
        <RotateCcw className="w-4 h-4" strokeWidth={2} />
      </button>
      <div className="flex-1 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-xs">Velocidad: {audioSpeed}×</p>
      </div>
    </div>
  );
}
