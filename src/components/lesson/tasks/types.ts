/**
 * Tipos compartidos por los componentes de tarea.
 *
 * Cada tipo define el shape esperado del campo `content_json` en la tabla
 * `tasks` de Supabase. El TaskRunner valida en runtime antes de pasar al
 * componente correspondiente.
 */

export interface VocabContent {
  word: string;
  translation: string;
  audio_url?: string;
  hint?: string;
}

export interface GrammarContent {
  sentence_segments: Array<
    | { type: 'text'; content: string }
    | {
        type: 'marker';
        content: string;
        marker_type?: string;
        hint?: string;
      }
  >;
  prompt: string;
  options: string[];
  correct: string;
}

export interface ListeningContent {
  audio_url: string;
  prompt: string;
  options: string[];
  correct: string;
}

export interface ReadingContent {
  text_segments: Array<
    | { type: 'text'; content: string }
    | {
        type: 'marker';
        content: string;
        marker_type?: string;
        hint?: string;
      }
  >;
  prompt: string;
  options: string[];
  correct: string;
}

export type TaskContent =
  | VocabContent
  | GrammarContent
  | ListeningContent
  | ReadingContent;

export interface TaskResult {
  success: boolean;
  timeSpentSeconds: number;
  attempts: number;
}
