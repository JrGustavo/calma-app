'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioPlayer } from '@/components/lesson/AudioPlayer';
import { cn } from '@/lib/utils';
import type { ListeningContent, TaskResult } from './types';

interface ListeningExerciseProps {
  content: ListeningContent;
  onComplete: (result: Pick<TaskResult, 'success'>) => void;
}

export function ListeningExercise({
  content,
  onComplete,
}: ListeningExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === content.correct;

  return (
    <Card variant="elevated">
      <p className="text-sm text-text-muted mb-2">Comprensión auditiva</p>

      <div className="mb-6">
        <AudioPlayer src={content.audio_url} label="Escucha con atención" />
      </div>

      <p className="font-medium mb-3">{content.prompt}</p>

      <div role="radiogroup" className="space-y-2 mb-6">
        {content.options.map((option) => {
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={submitted}
              onClick={() => setSelected(option)}
              className={cn(
                'w-full text-left p-3 rounded-md border transition-colors min-h-[44px]',
                isSelected
                  ? 'bg-bg-elevated border-text-secondary'
                  : 'bg-bg-primary border-border hover:bg-bg-alt',
                submitted && 'cursor-not-allowed opacity-70'
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <Button
          size="lg"
          disabled={!selected}
          onClick={() => setSubmitted(true)}
          className="w-full"
        >
          Verificar
        </Button>
      ) : (
        <div>
          <p
            className={cn(
              'mb-4 px-3 py-2 rounded-md border-l-2',
              isCorrect
                ? 'bg-bg-alt border-success-muted'
                : 'bg-bg-alt border-warning-muted'
            )}
          >
            {isCorrect ? '¡Correcto!' : 'Vamos a revisarlo juntos.'}
          </p>
          <Button
            size="lg"
            onClick={() => onComplete({ success: isCorrect })}
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      )}
    </Card>
  );
}
