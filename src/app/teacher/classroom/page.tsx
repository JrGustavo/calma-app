import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface MembershipWithStudent {
  id: string;
  classroom_name: string;
  student_id: string;
}

interface ProfileRow {
  id: string;
  display_name: string;
  role: string;
}

export default async function ClassroomPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Cargar memberships actuales
  const { data: membershipsData } = await supabase
    .from('classroom_memberships')
    .select('id, classroom_name, student_id')
    .eq('teacher_id', user.id);
  const memberships = (membershipsData ?? []) as MembershipWithStudent[];

  // Cargar nombres de estudiantes
  const studentIds = memberships.map((m) => m.student_id);
  let studentNames: Record<string, string> = {};
  if (studentIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, display_name, role')
      .in('id', studentIds);
    const profiles = (profilesData ?? []) as ProfileRow[];
    studentNames = Object.fromEntries(
      profiles.map((p) => [p.id, p.display_name])
    );
  }

  async function addStudent(formData: FormData) {
    'use server';
    const email = formData.get('email');
    const classroomName = formData.get('classroom_name');

    if (typeof email !== 'string' || typeof classroomName !== 'string') {
      redirect('/teacher/classroom?error=missing-fields');
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Buscar al estudiante por email vía RPC sería más limpio. Simplificamos:
    // pedimos al estudiante que se registre primero y nos dé su display_name
    // (o el id directo). Aquí asumimos que el teacher conoce el display_name.
    const { data: studentData } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('display_name', email as string)
      .eq('role', 'student')
      .maybeSingle();

    const student = studentData as { id: string; role: string } | null;

    if (!student) {
      redirect(
        '/teacher/classroom?error=' +
          encodeURIComponent(
            'No se encontró un estudiante con ese nombre. Pídele que se registre primero.'
          )
      );
    }

    const { error } = await supabase.from('classroom_memberships').insert({
      teacher_id: user.id,
      student_id: student!.id,
      classroom_name: classroomName as string,
    });

    if (error) {
      redirect(
        '/teacher/classroom?error=' + encodeURIComponent(error.message)
      );
    }

    revalidatePath('/teacher/classroom');
    redirect('/teacher/classroom?success=1');
  }

  async function removeStudent(formData: FormData) {
    'use server';
    const id = formData.get('membership_id');
    if (typeof id !== 'string') return;

    const supabase = await createClient();
    await supabase.from('classroom_memberships').delete().eq('id', id);
    revalidatePath('/teacher/classroom');
  }

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-6">
          <Link
            href="/teacher/dashboard"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>

          <header>
            <h1 className="text-3xl font-bold mb-2">Gestionar aula</h1>
            <p className="text-text-secondary">
              Vincula estudiantes a tu aula para ver su progreso.
            </p>
          </header>

          {params.error && (
            <div
              role="alert"
              className="px-3 py-2 text-sm bg-bg-alt border-l-2 border-warning-muted rounded-sm"
            >
              {params.error}
            </div>
          )}
          {params.success && (
            <div
              role="alert"
              className="px-3 py-2 text-sm bg-bg-alt border-l-2 border-success-muted rounded-sm"
            >
              Estudiante agregado.
            </div>
          )}

          <Card variant="elevated">
            <h2 className="text-lg font-bold mb-1">Agregar estudiante</h2>
            <p className="text-sm text-text-secondary mb-4">
              Ingresa el nombre con el que el estudiante se registró.
            </p>
            <form action={addStudent} className="space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                >
                  Nombre del estudiante
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="classroom_name"
                  className="block text-sm font-medium mb-1.5"
                >
                  Nombre del aula
                </label>
                <input
                  id="classroom_name"
                  name="classroom_name"
                  type="text"
                  required
                  defaultValue="Mi aula"
                  className="w-full min-h-[44px] px-3 bg-bg-primary border border-border rounded-md"
                />
              </div>
              <Button type="submit">Agregar</Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-3">Estudiantes vinculados</h2>
            {memberships.length === 0 ? (
              <p className="text-text-secondary">Aún no hay estudiantes.</p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {memberships.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between py-3 gap-3"
                  >
                    <div>
                      <p className="font-medium">
                        {studentNames[m.student_id] ?? '(estudiante)'}
                      </p>
                      <p className="text-sm text-text-muted">
                        {m.classroom_name}
                      </p>
                    </div>
                    <form action={removeStudent}>
                      <input
                        type="hidden"
                        name="membership_id"
                        value={m.id}
                      />
                      <Button type="submit" variant="ghost">
                        Quitar
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
