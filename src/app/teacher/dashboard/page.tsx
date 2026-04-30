import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/queries';
import { CognitiveBatteryPanel } from '@/components/settings/CognitiveBatteryPanel';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { PreferencesHydrator } from '@/components/auth/PreferencesHydrator';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ClassroomMembershipRow {
  student_id: string;
  classroom_name: string;
}

interface StudentProfileRow {
  id: string;
  display_name: string;
  cefr_level: string;
}

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const profile = await getUserProfile(supabase, user.id);

  // Estudiantes en sus aulas
  const { data: membershipsData } = await supabase
    .from('classroom_memberships')
    .select('student_id, classroom_name')
    .eq('teacher_id', user.id);

  const memberships = (membershipsData ?? []) as ClassroomMembershipRow[];
  const studentIds = memberships.map((m) => m.student_id);

  let students: StudentProfileRow[] = [];
  if (studentIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, display_name, cefr_level')
      .in('id', studentIds);
    students = (profilesData ?? []) as StudentProfileRow[];
  }

  return (
    <>
      <PreferencesHydrator userId={user.id} />
      <CognitiveBatteryPanel />
      <main className="min-h-screen px-6 py-12">
        <div className="max-w-prose mx-auto space-y-8">
          <header className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-text-muted mb-1">Hola,</p>
              <h1 className="text-3xl font-bold">
                {profile?.display_name ?? 'Docente'}
              </h1>
              <p className="text-text-secondary mt-2">
                {students.length} estudiantes asignados
              </p>
            </div>
            <LogoutButton />
          </header>

          <Card variant="elevated">
            <h2 className="text-lg font-bold mb-3">Mis estudiantes</h2>
            {students.length === 0 ? (
              <p className="text-text-secondary">
                Todavía no tienes estudiantes asignados. Pídele a tus
                estudiantes su correo y vincúlalos desde la sección de aulas.
              </p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {students.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between py-3 gap-3 flex-wrap"
                  >
                    <div>
                      <p className="font-medium">{s.display_name}</p>
                      <p className="text-sm text-text-muted">
                        Nivel {s.cefr_level}
                      </p>
                    </div>
                    <Link href={`/teacher/students/${s.id}`}>
                      <Button variant="secondary">Ver progreso</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-2">Lecciones</h2>
            <p className="text-text-secondary mb-4">
              Crea, edita y publica lecciones por nivel del MCER.
            </p>
            <Link href="/teacher/lessons">
              <Button>Gestionar lecciones</Button>
            </Link>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-2">Aulas</h2>
            <p className="text-text-secondary mb-4">
              Vincula estudiantes a tu aula con su correo.
            </p>
            <Link href="/teacher/classroom">
              <Button variant="secondary">Gestionar aula</Button>
            </Link>
          </Card>
        </div>
      </main>
    </>
  );
}
