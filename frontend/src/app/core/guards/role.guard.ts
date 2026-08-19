import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Factory de guard por rol.
 * Uso: canActivate: [roleGuard('ADMIN')]
 *
 * Verifica que el usuario autenticado tenga el rol requerido.
 * Si no tiene permiso, redirige al dashboard principal.
 */
export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return (_route, _state) => {
    const authService = inject(AuthService);
    const router      = inject(Router);

    const user = authService.currentUser();

    // Sin sesión → login
    if (!user) {
      return router.createUrlTree(['/login']);
    }

    // Verificar que el rol del usuario esté en los roles permitidos
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Sin permiso suficiente → redirigir al dashboard raíz
    return router.createUrlTree(['/dashboard']);
  };
}
