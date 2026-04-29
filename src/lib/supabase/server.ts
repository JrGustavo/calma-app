import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

/**
 * Cliente Supabase para Server Components, Server Actions y Route Handlers.
 *
 * Lee y escribe cookies para mantener la sesión sincronizada.
 * El catch en cookies.set() es necesario porque Server Components
 * no pueden setear cookies — solo Route Handlers y Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components no pueden setear cookies.
            // Esto es esperado y se ignora — el middleware refresca las cookies.
          }
        },
      },
    }
  );
}
