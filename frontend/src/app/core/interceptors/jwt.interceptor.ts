import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional JWT.
 * - Adjunta el Bearer token en cada petición saliente.
 * - Detecta respuestas 401 con error 'TokenExpiredError' y activa el modal.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Clonar la petición e inyectar el header Authorization si existe token
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Detectar token expirado por el campo 'error' del payload del backend
      if (
        error.status === 401 &&
        error.error?.error === 'TokenExpiredError'
      ) {
        authService.triggerSessionExpired();
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
