import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticación.
 * Verifica que exista un token activo en localStorage.
 * Si no hay sesión, redirige a /login.
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Sin sesión → redirigir al login
  return router.createUrlTree(['/login']);
};
