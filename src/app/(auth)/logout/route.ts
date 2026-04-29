import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Logout endpoint. Invalida la sesión y redirige a /.
 * Acepta POST para evitar logouts accidentales por prefetching.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/', request.url), {
    status: 303, // See Other — el navegador hace GET tras el redirect
  });
}
