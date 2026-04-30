import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Feedback — Calma',
};

const VALID_CATEGORIES = ['uso', 'diseno', 'contenido', 'tecnico', 'sugerencia', 'otro'] as const;

interface FeedbackPageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function FeedbackPage({ searchParams }: FeedbackPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole: string | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    userRole = (data as { role?: string } | null)?.role ?? null;
  }

  async function submitFeedback(formData: FormData) {
    'use server';

    const message = formData.get('message');
    const category = formData.get('category');
    const ratingStr = formData.get('rating');

    if (typeof message !== 'string' || message.trim().length < 10) {
      redirect('/feedback?error=' + encodeURIComponent('Tu mensaje debe tener al menos 10 caracteres.'));
    }
    if (message.length > 2000) {
      redirect('/feedback?error=' + encodeURIComponent('Tu mensaje es demasiado largo (máx 2000 caracteres).'));
    }
    if (typeof category !== 'string' || !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      redirect('/feedback?error=invalid-category');
    }

    const rating = typeof ratingStr === 'string' ? parseInt(ratingStr, 10) : null;
    if (rating !== null && (isNaN(rating) || rating < 1 || rating > 5)) {
      redirect('/feedback?error=invalid-rating');
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userRole: string | null = null;
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      userRole = (data as { role?: string } | null)?.role ?? null;
    }

    const { error } = await supabase.from('feedback').insert({
      user_id: user?.id ?? null,
      user_role: userRole,
      rating: rating,
      category: category as string,
      message: message.trim(),
    });

    if (error) {
      redirect('/feedback?error=' + encodeURIComponent(error.message));
    }

    redirect('/feedback?success=1');
  }

  return (
    <>
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>

          <header>
            <h1 className="text-3xl font-bold mb-2">
              Llena este formulario y ayúdanos a crecer
            </h1>
            <p className="text-text-secondary">
              En Calma, creemos en la construcción colectiva. Ayúdanos a
              validar esta experiencia para que más niños y niñas puedan
              habitar un bilingüismo sereno.
            </p>
          </header>

          {params.success && (
            <div
              role="alert"
              className="px-4 py-3 bg-bg-alt border-l-2 border-success-muted rounded-sm"
            >
              <p className="font-medium">¡Gracias por tu feedback!</p>
              <p className="text-sm text-text-secondary">
                Cada comentario nos ayuda a mejorar.
              </p>
            </div>
          )}

          {params.error && (
            <div
              role="alert"
              className="px-3 py-2 text-sm bg-bg-alt border-l-2 border-warning-muted rounded-sm"
            >
              {params.error}
            </div>
          )}

          <Card variant="elevated">
            <form action={submitFeedback} className="space-y-5">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1.5">
                  ¿Sobre qué quieres contarnos?
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue="uso"
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                >
                  <option value="uso">Cómo se usa la aplicación</option>
                  <option value="diseno">Diseño y aspecto visual</option>
                  <option value="contenido">Las lecciones y el contenido</option>
                  <option value="tecnico">Un problema técnico</option>
                  <option value="sugerencia">Una sugerencia o idea</option>
                  <option value="otro">Otra cosa</option>
                </select>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium mb-1.5">
                  ¿Cómo calificarías tu experiencia? (opcional)
                </legend>
                <div role="radiogroup" className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label
                      key={n}
                      className="flex-1 min-w-[60px] flex items-center justify-center min-h-[44px] px-3 bg-bg-primary border border-border rounded-md cursor-pointer hover:bg-bg-alt transition-colors"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        className="sr-only peer"
                      />
                      <span className="peer-checked:font-bold peer-checked:underline">
                        {n}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  1 = Necesita mejorar · 5 = Excelente
                </p>
              </fieldset>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                  Cuéntanos
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  minLength={10}
                  maxLength={2000}
                  placeholder="Lo que más te gustó, lo que cambiarías, lo que te confundió, lo que esperabas encontrar..."
                  className="w-full px-3 py-2 bg-bg-primary border border-border rounded-md"
                />
                <p className="text-xs text-text-muted mt-1.5">
                  Entre 10 y 2000 caracteres.
                </p>
              </div>

              {!user && (
                <p className="text-xs text-text-muted">
                  Estás enviando feedback sin iniciar sesión. Tu mensaje
                  llegará de forma anónima.
                </p>
              )}
              {user && userRole && (
                <p className="text-xs text-text-muted">
                  Enviando como {userRole === 'student' ? 'estudiante' : userRole === 'teacher' ? 'docente' : 'familia'}.
                </p>
              )}

              <Button type="submit" size="lg">
                Enviar feedback
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
