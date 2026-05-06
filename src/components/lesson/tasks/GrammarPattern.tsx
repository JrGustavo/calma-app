'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GrammarMarker } from '@/components/lesson/GrammarMarker';
import { TextToSpeech } from '@/components/lesson/TextToSpeech';
import { cn } from '@/lib/utils';
import type { GrammarContent, TaskResult } from './types';

type GrammarMarkerType_ = Parameters<typeof GrammarMarker>[0]['type'];

interface GrammarPatternProps {
  content: GrammarContent;
  onComplete: (result: Pick<TaskResult, 'success'>) => void;
}

export function GrammarPattern({ content, onComplete }: GrammarPatternProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === content.correct;
  const fullSentence = content.sentence_segments.map((s) => s.content).join('');

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-sm text-text-muted">¿Cómo se dice?</p>
        <TextToSpeech text={fullSentence} lang="en-US" />
      </div>

      <div className="text-xl leading-relaxed mb-6 max-w-prose">
        {content.sentence_segments.map((seg, i) =>
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
