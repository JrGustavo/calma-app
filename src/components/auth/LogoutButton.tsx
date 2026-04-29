import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * LogoutButton — usa POST para evitar prefetch accidental.
 */
export function LogoutButton() {
  return (
    <form action="/logout" method="post">
      <Button type="submit" variant="ghost" size="md">
        <LogOut className="w-4 h-4" strokeWidth={1.75} />
        <span>Cerrar sesión</span>
      </Button>
    </form>
  );
}
