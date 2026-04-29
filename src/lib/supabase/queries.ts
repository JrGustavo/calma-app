import type { createClient as createServerClient } from '@/lib/supabase/server';
import type { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/database';

/**
 * Tipo del cliente Supabase (server o browser).
 * Se infiere desde nuestros propios wrappers — esto evita el problema
 * de los generics inestables entre versiones de @supabase/ssr.
 */
type SupabaseClient =
  | Awaited<ReturnType<typeof createServerClient>>
  | ReturnType<typeof createBrowserClient>;

const VALID_ROLES: UserRole[] = ['student', 'teacher', 'parent'];

function isValidRole(value: unknown): value is UserRole {
  return typeof value === 'string' && VALID_ROLES.includes(value as UserRole);
}

/**
 * Obtiene el rol del usuario autenticado.
 * Retorna 'student' por defecto si no se encuentra profile (defensa).
 */
export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<UserRole> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) return 'student';

  // El tipo de data es 'never' por la inferencia de @supabase/ssr sin schema typing.
  // Hacemos cast manual a un shape conocido.
  const profileData = data as { role?: unknown };

  if (!isValidRole(profileData.role)) return 'student';

  return profileData.role;
}

/**
 * Obtiene el dashboard correspondiente al rol del usuario.
 */
export function dashboardPathForRole(role: UserRole): string {
  return `/${role}/dashboard`;
}

/**
 * Obtiene profile básico (display_name, role, cefr_level).
 * Retorna null si no existe.
 */
export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  display_name: string;
  role: UserRole;
  cefr_level: string;
} | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, role, cefr_level')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  const profileData = data as {
    display_name?: unknown;
    role?: unknown;
    cefr_level?: unknown;
  };

  return {
    display_name:
      typeof profileData.display_name === 'string'
        ? profileData.display_name
        : '',
    role: isValidRole(profileData.role) ? profileData.role : 'student',
    cefr_level:
      typeof profileData.cefr_level === 'string' ? profileData.cefr_level : 'A1',
  };
}
