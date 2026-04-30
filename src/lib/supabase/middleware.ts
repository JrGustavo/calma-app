import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/types/database';

const VALID_ROLES: UserRole[] = ['student', 'teacher', 'parent'];

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

function isValidRole(value: unknown): value is UserRole {
  return typeof value === 'string' && VALID_ROLES.includes(value as UserRole);
}

/**
 * Update de sesión Supabase desde el middleware de Next.
 *
 * Se ejecuta en cada request para refrescar tokens si están por expirar.
 * También aplica protección de rutas según el rol del usuario.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: getUser() valida la sesión contra el servidor de auth.
  // No usar getSession() aquí — solo lee cookies sin validar.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren auth
  const publicRoutes = ['/', '/showcase', '/login', '/signup', '/auth', '/mediation-guide'];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
    const role = await fetchUserRole(supabase, user.id);
    const url = request.nextUrl.clone();
    url.pathname = `/${role}/dashboard`;
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (user) {
    const roleRouteMatch = pathname.match(/^\/(student|teacher|parent)\//);
    if (roleRouteMatch) {
      const requiredRole = roleRouteMatch[1] as UserRole;
      const userRole = await fetchUserRole(supabase, user.id);

      if (userRole !== requiredRole) {
        const url = request.nextUrl.clone();
        url.pathname = `/${userRole}/dashboard`;
        url.search = '';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

/**
 * Helper local del middleware. Evita import desde queries.ts porque
 * ese helper espera el cliente de @/lib/supabase/server y aquí usamos
 * directamente createServerClient de @supabase/ssr con cookies del request.
 */
async function fetchUserRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<UserRole> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) return 'student';

  const profileData = data as { role?: unknown };
  if (!isValidRole(profileData.role)) return 'student';

  return profileData.role;
}
