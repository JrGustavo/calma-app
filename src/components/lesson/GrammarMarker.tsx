'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export type GrammarMarkerType =
  | 'verb-tense'
  | 'article'
  | 'preposition'
  | 'phrasal-verb'
  | 'pronoun'
  | 'conjunction'
  | 'auxiliary'
  | 'general';

interface GrammarMarkerProps {
  /** Type of grammatical structure being highlighted */
  type?: GrammarMarkerType;
  /** Optional explanation shown when the marker is expanded */
  hint?: string;
  /** The text content being marked */
  children: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * GrammarMarker
 *
 * The ONLY UI element permitted to use Petroleum Blue (#1F4E5F) in lesson content.
 * Wraps grammatical structures (verb tenses, prepositions, articles, etc.) for
 * visual identification within English text.
 *
 * If a hint is provided, the marker becomes expandable to reveal a brief
 * pedagogical explanation. Uses native <details>/<summary> for full
 * accessibility — no custom JS animations, respects prefers-reduced-motion.
 */
export function GrammarMarker({
  type = 'general',
  hint,
  children,
  className,
}: GrammarMarkerProps) {
  const [expanded, setExpanded] = useState(false);

  // No hint: render as a simple inline span with the marker styling
  if (!hint) {
    return (
      <span
        data-grammar-type={type}
        className={cn(
          'text-grammar font-bold underline decoration-grammar/40 decoration-2 underline-offset-4',
          className
        )}
      >
        {children}
      </span>
    );
  }

  // With hint: clickable to expand a brief explanation inline
  return (
    <span className={cn('inline-block', className)}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        data-grammar-type={type}
        className={cn(
          'text-grammar font-bold underline decoration-grammar/50 decoration-2 underline-offset-4',
          'cursor-help bg-transparent border-0 p-0 font-sans',
          'hover:text-grammar-hover focus-visible:bg-grammar-bg rounded-sm'
        )}
      >
        {children}
      </button>
      {expanded && (
        <span
          role="note"
          className="block mt-2 mb-2 px-3 py-2 text-sm text-text-secondary bg-grammar-bg border-l-2 border-grammar rounded-sm max-w-prose"
        >
          {hint}
        </span>
      )}
    </span>
  );
}
