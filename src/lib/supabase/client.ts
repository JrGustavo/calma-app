import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente Supabase para uso en Client Components.
 *
 * Vive en el navegador. Las cookies se manejan automáticamente
 * por @supabase/ssr — no necesitas pasar nada manualmente.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
