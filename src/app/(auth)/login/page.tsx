import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserRole, dashboardPathForRole } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params.error;
  const redirectTo = params.redirect;

  async function login(formData: FormData) {
    'use server';

    const email = formData.get('email');
    const password = formData.get('password');
    const redirectAfter = formData.get('redirect');

    if (typeof email !== 'string' || typeof password !== 'string') {
      redirect('/login?error=missing-fields');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    });

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login?error=unknown');
    }

    const role = await getUserRole(supabase, user.id);
    const target =
      typeof redirectAfter === 'string' && redirectAfter
        ? redirectAfter
        : dashboardPathForRole(role);
    redirect(target);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <Card variant="elevated">
          <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>
          <p className="text-text-secondary mb-6">
            Ingresa con tu correo y contraseña.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 px-3 py-2 text-sm bg-bg-alt border-l-2 border-warning-muted rounded-sm text-text-primary"
            >
              {errorMessage}
            </div>
          )}

          <form action={login} className="space-y-4">
            {redirectTo && (
              <input type="hidden" name="redirect" value={redirectTo} />
            )}

            <FormField
              label="Correo electrónico"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />

            <Button type="submit" size="lg" className="w-full">
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-sm text-text-secondary text-center">
            ¿No tienes cuenta?{' '}
            <Link
              href="/signup"
              className="text-text-primary underline hover:no-underline"
            >
              Crear cuenta
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

// ────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function FormField({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-text-primary mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-secondary transition-colors"
      />
    </div>
  );
}
