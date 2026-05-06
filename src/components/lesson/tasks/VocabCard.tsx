'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioPlayer } from '@/components/lesson/AudioPlayer';
import { TextToSpeech } from '@/components/lesson/TextToSpeech';
import type { VocabContent, TaskResult } from './types';

interface VocabCardProps {
  content: VocabContent;
  onComplete: (result: Pick<TaskResult, 'success'>) => void;
}

export function VocabCard({ content, onComplete }: VocabCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Card variant="elevated" className="text-center">
      <p className="text-sm text-text-muted mb-2">Palabra nueva</p>
      <div className="flex items-center justify-center gap-3 mb-6">
        <h2 className="text-3xl font-bold">{content.word}</h2>
        <TextToSpeech text={content.word} lang="en-US" size="md" />
      </div>

      {content.audio_url && (
        <div className="mb-6 max-w-sm mx-auto">
          <AudioPlayer src={content.audio_url} label="Pronunciación" />
        </div>
      )}

      {!revealed ? (
        <Button size="lg" onClick={() => setRevealed(true)}>
          Mostrar significado
        </Button>
      ) : (
        <>
          <p className="text-lg mb-2">
            Significa: <span className="font-bold">{content.translation}</span>
          </p>
          {content.hint && (
            <p className="text-sm text-text-secondary mb-6 max-w-prose mx-auto">
              {content.hint}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              variant="secondary"
              onClick={() => onComplete({ success: false })}
            >
              Practiquemos esta
            </Button>
            <Button onClick={() => onComplete({ success: true })}>
              La conozco
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
