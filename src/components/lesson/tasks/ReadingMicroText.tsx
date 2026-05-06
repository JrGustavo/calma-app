'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GrammarMarker } from '@/components/lesson/GrammarMarker';
import { TextToSpeech } from '@/components/lesson/TextToSpeech';
import { cn } from '@/lib/utils';
import type { ReadingContent, TaskResult } from './types';

type GrammarMarkerType_ = Parameters<typeof GrammarMarker>[0]['type'];

interface ReadingMicroTextProps {
  content: ReadingContent;
  onComplete: (result: Pick<TaskResult, 'success'>) => void;
}

export function ReadingMicroText({
  content,
  onComplete,
}: ReadingMicroTextProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === content.correct;
  const fullText = content.text_segments.map((s) => s.content).join('');

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-sm text-text-muted">Lee y descubre</p>
        <TextToSpeech text={fullText} lang="en-US" />
      </div>

      <div className="text-lg leading-relaxed mb-6 max-w-prose">
        {content.text_segments.map((seg, i) =>
          seg.type === 'text' ? (
            <span key={i}>{seg.content}</span>
          ) : (
            <GrammarMarker
              key={i}
              type={(seg.marker_type as GrammarMarkerType_) ?? 'general'}
              hint={seg.hint}
            >
              {seg.content}
            </GrammarMarker>
          )
        )}
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
