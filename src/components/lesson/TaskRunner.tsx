'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FocusShield } from '@/components/lesson/FocusShield';
import { VocabCard } from '@/components/lesson/tasks/VocabCard';
import { GrammarPattern } from '@/components/lesson/tasks/GrammarPattern';
import { ListeningExercise } from '@/components/lesson/tasks/ListeningExercise';
import { ReadingMicroText } from '@/components/lesson/tasks/ReadingMicroText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type {
  VocabContent,
  GrammarContent,
  ListeningContent,
  ReadingContent,
} from '@/components/lesson/tasks/types';

interface TaskRow {
  id: string;
  task_type: 'vocab' | 'grammar' | 'listening' | 'reading';
  content_json: unknown;
  order_index: number;
}

interface TaskRunnerProps {
  studentId: string;
  lessonId: string;
  lessonTitle: string;
  tasks: TaskRow[];
}

/**
 * TaskRunner
 *
 * Orquesta la ejecución secuencial de las micro-tareas de una lección:
 * - Una tarea visible en pantalla a la vez
 * - Pausa breve de respiración entre tareas (5s)
 * - Registro de progreso por tarea en Supabase
 * - Registro de focus_breaks por sesión
 * - Pantalla final sin gamificación
 */
export function TaskRunner({
  studentId,
  lessonId,
  lessonTitle,
  tasks,
}: TaskRunnerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [breathing, setBreathing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const taskStartRef = useRef<number>(Date.now());
  const focusBreaksRef = useRef(0);

  // Crear session_log al montar
  useEffect(() => {
    let cancelled = false;
    async function startSession() {
      const { data, error } = await supabase
        .from('session_logs')
        .insert({
          student_id: studentId,
          lesson_id: lessonId,
          shield_mode_active: true,
        })
        .select('id')
        .single();
      if (!cancelled && data && !error) {
        const row = data as { id: string };
        setSessionId(row.id);
      }
    }
    startSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, lessonId]);

  // Cerrar session_log al desmontar
  useEffect(() => {
    return () => {
      if (sessionId) {
        // Fire and forget; no async cleanup en useEffect
        supabase
          .from('session_logs')
          .update({
            ended_at: new Date().toISOString(),
            focus_breaks: focusBreaksRef.current,
          })
          .eq('id', sessionId)
          .then(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  function handleFocusBreak() {
    focusBreaksRef.current += 1;
  }

  async function handleTaskComplete(success: boolean) {
    const task = tasks[currentIndex];
    const timeSpent = Math.round((Date.now() - taskStartRef.current) / 1000);

    // Registrar progreso (fire and forget)
    supabase
      .from('student_progress')
      .insert({
        student_id: studentId,
        task_id: task.id,
        time_spent_seconds: timeSpent,
        attempts: 1,
        success,
      })
      .then(() => {});

    // Pausa de respiración (excepto en la última)
    const isLast = currentIndex >= tasks.length - 1;
    if (isLast) {
      setCompleted(true);
      return;
    }

    setBreathing(true);
    setTimeout(() => {
      setBreathing(false);
      setCurrentIndex((i) => i + 1);
      taskStartRef.current = Date.now();
    }, 3000);
  }

  if (completed) {
    return (
      <FocusShield onFocusBreak={handleFocusBreak} requestFullscreen={false}>
        <main className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className="max-w-prose text-center">
            <h1 className="text-3xl font-bold mb-4">Lección completa.</h1>
            <p className="text-text-secondary mb-10">Bien hecho.</p>
            <Button
              size="lg"
              onClick={() => router.push('/student/dashboard')}
            >
              Continuar
            </Button>
          </div>
        </main>
      </FocusShield>
    );
  }

  const currentTask = tasks[currentIndex];

  return (
    <FocusShield onFocusBreak={handleFocusBreak}>
      <main className="min-h-screen px-6 py-20">
        <div className="max-w-prose mx-auto">
          {/* Progreso */}
          <div className="mb-8">
            <p className="text-sm text-text-muted mb-2">{lessonTitle}</p>
            <ProgressBar current={currentIndex + 1} total={tasks.length} />
          </div>

          {breathing ? (
            <BreathingPause />
          ) : (
            <TaskByType
              task={currentTask}
              onComplete={(r) => handleTaskComplete(r.success)}
            />
          )}
        </div>
      </main>
    </FocusShield>
  );
}

// ────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = (current / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs text-text-muted mb-1">
        <span>
          Tarea {current} de {total}
        </span>
      </div>
      <div className="h-2 bg-bg-alt rounded-full overflow-hidden border border-border-subtle">
        <div
          className="h-full bg-text-secondary transition-all duration-200"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}

function BreathingPause() {
  return (
    <Card className="text-center">
      <p className="text-text-secondary mb-2">Respira un momento.</p>
      <p className="text-sm text-text-muted">Continuamos en unos segundos.</p>
    </Card>
  );
}

function TaskByType({
  task,
  onComplete,
}: {
  task: TaskRow;
  onComplete: (r: { success: boolean }) => void;
}) {
  switch (task.task_type) {
    case 'vocab':
      return (
        <VocabCard
          content={task.content_json as VocabContent}
          onComplete={onComplete}
        />
      );
    case 'grammar':
      return (
        <GrammarPattern
          content={task.content_json as GrammarContent}
          onComplete={onComplete}
        />
      );
    case 'listening':
      return (
        <ListeningExercise
          content={task.content_json as ListeningContent}
          onComplete={onComplete}
        />
      );
    case 'reading':
      return (
        <ReadingMicroText
          content={task.content_json as ReadingContent}
          onComplete={onComplete}
        />
      );
    default:
      return (
        <Card>
          <p>Tipo de tarea no reconocido.</p>
        </Card>
      );
  }
}
