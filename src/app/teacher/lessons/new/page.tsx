import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default async function NewLessonPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  async function createLesson(formData: FormData) {
    'use server';
    const title = formData.get('title');
    const description = formData.get('description');
    const cefrLevel = formData.get('cefr_level');
    const estimatedMinutes = formData.get('estimated_minutes');

    if (
      typeof title !== 'string' ||
      typeof cefrLevel !== 'string' ||
      typeof estimatedMinutes !== 'string'
    ) {
      redirect('/teacher/lessons/new?error=missing-fields');
    }

    const supabase = await createClient();

    // Calcular order_index
    const { data: existing } = await supabase
      .from('lessons')
      .select('order_index')
      .eq('cefr_level', cefrLevel as string)
      .order('order_index', { ascending: false })
      .limit(1);
    const lastOrder =
      ((existing ?? [])[0] as { order_index: number } | undefined)?.order_index ?? 0;

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        title: title as string,
        description: typeof description === 'string' ? description : null,
        cefr_level: cefrLevel as string,
        estimated_minutes: parseInt(estimatedMinutes as string, 10) || 10,
        order_index: lastOrder + 1,
        is_published: false,
      })
      .select('id')
      .single();

    if (error || !data) {
      redirect('/teacher/lessons/new?error=' + encodeURIComponent(error?.message ?? 'unknown'));
    }

    const created = data as { id: string };
    redirect(`/teacher/lessons/${created.id}`);
  }

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/teacher/lessons"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <h1 className="text-3xl font-bold">Nueva lección</h1>

          <Card variant="elevated">
            <form action={createLesson} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                  Título
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="cefr_level" className="block text-sm font-medium mb-1.5">
                  Nivel MCER
                </label>
                <select
                  id="cefr_level"
                  name="cefr_level"
                  required
                  defaultValue="A1"
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>

              <div>
                <label htmlFor="estimated_minutes" className="block text-sm font-medium mb-1.5">
                  Duración estimada (minutos)
                </label>
                <input
                  id="estimated_minutes"
                  name="estimated_minutes"
                  type="number"
                  min="1"
                  max="60"
                  defaultValue="10"
                  required
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                />
              </div>

              <Button type="submit" size="lg">
                Crear lección
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </>
  );
}
