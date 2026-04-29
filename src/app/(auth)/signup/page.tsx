import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { dashboardPathForRole } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { UserRole } from '@/types/database';

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

const VALID_ROLES: UserRole[] = ['student', 'teacher', 'parent'];

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const errorMessage = params.error;

  async function signup(formData: FormData) {
    'use server';

    const email = formData.get('email');
    const password = formData.get('password');
    const displayName = formData.get('display_name');
    const roleInput = formData.get('role');

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof displayName !== 'string' ||
      typeof roleInput !== 'string'
    ) {
      redirect('/signup?error=missing-fields');
    }

    if ((password as string).length < 8) {
      redirect(
        '/signup?error=' +
          encodeURIComponent('La contraseña debe tener al menos 8 caracteres.')
      );
    }

    if (!VALID_ROLES.includes(roleInput as UserRole)) {
      redirect('/signup?error=invalid-role');
    }

    const role = roleInput as UserRole;
    const supabase = await createClient();

    // El trigger de Supabase (handle_new_user) lee role y display_name del
    // raw_user_meta_data y crea automáticamente el profile + preferences.
    const { error } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        data: {
          role,
          display_name: displayName,
        },
      },
    });

    if (error) {
      redirect(`/signup?error=${encodeURIComponent(error.message)}`);
    }

    redirect(dashboardPathForRole(role));
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
          <h1 className="text-2xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-text-secondary mb-6">
            Empieza a aprender o a acompañar el aprendizaje.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 px-3 py-2 text-sm bg-bg-alt border-l-2 border-warning-muted rounded-sm text-text-primary"
            >
              {errorMessage}
            </div>
          )}

          <form action={signup} className="space-y-4">
            <FormField
              label="Nombre para mostrar"
              name="display_name"
              required
              autoComplete="name"
              hint="Cómo quieres que te llamemos."
            />

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
              autoComplete="new-password"
              hint="Mínimo 8 caracteres."
            />

            <RoleSelector />

            <Button type="submit" size="lg" className="w-full">
              Crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-sm text-text-secondary text-center">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-text-primary underline hover:no-underline"
            >
              Iniciar sesión
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
  hint?: string;
}

function FormField({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  hint,
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
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

function RoleSelector() {
  const roles: { value: UserRole; label: string; description: string }[] = [
    {
      value: 'student',
      label: 'Estudiante',
      description: 'Voy a aprender inglés',
    },
    {
      value: 'teacher',
      label: 'Docente',
      description: 'Acompaño a un grupo de estudiantes',
    },
    {
      value: 'parent',
      label: 'Padre/Madre',
      description: 'Acompaño a mi hijo/a',
    },
  ];

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-text-primary mb-1.5">
        ¿Quién eres?
      </legend>
      <div className="space-y-2">
        {roles.map((role, idx) => (
          <label
            key={role.value}
            className="flex items-start gap-3 p-3 bg-bg-primary border border-border rounded-md cursor-pointer hover:bg-bg-alt transition-colors"
          >
            <input
              type="radio"
              name="role"
              value={role.value}
              required
              defaultChecked={idx === 0}
              className="mt-1 w-4 h-4 accent-text-primary"
            />
            <span>
              <span className="block text-base font-medium text-text-primary">
                {role.label}
              </span>
              <span className="block text-sm text-text-secondary">
                {role.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
