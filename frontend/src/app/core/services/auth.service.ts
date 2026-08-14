import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {
  AuthSuccessResponse,
  LoginRequest,
  UserProfile,
} from '../models/auth.models';

const TOKEN_KEY   = 'auth_token';
const USER_KEY    = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signal reactivo con el perfil de usuario actual
  readonly currentUser = signal<UserProfile | null>(this.loadUser());

  constructor(private readonly http: HttpClient) {}

  // ─── Login ──────────────────────────────────────────────────
  login(credentials: LoginRequest): Observable<AuthSuccessResponse> {
    return this.http
      .post<AuthSuccessResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.saveSession(response.data.token, response.data.user);
        }),
        catchError(this.handleError)
      );
  }

  // ─── Logout ─────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  // ─── Helpers ────────────────────────────────────────────────
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ─── Privados ───────────────────────────────────────────────
  private saveSession(token: string, user: UserProfile): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ocurrió un error inesperado.';

    if (error.status === 0) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.status === 401) {
      message =
        'Credenciales inválidas. Verifica tu usuario/email y contraseña.';
    } else if (error.status === 400) {
      message = error.error?.message ?? 'Datos de entrada inválidos.';
    } else if (error.status >= 500) {
      message = 'Error interno del servidor. Intenta de nuevo más tarde.';
    }

    return throwError(() => new Error(message));
  }
}
