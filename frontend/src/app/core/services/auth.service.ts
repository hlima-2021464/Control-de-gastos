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

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

/** Decodifica el payload de un JWT sin verificar la firma (solo lectura de exp). */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → base64 → JSON
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json   = atob(base64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // ─── Signals reactivos ──────────────────────────────────────
  /** Perfil del usuario autenticado actual */
  readonly currentUser = signal<UserProfile | null>(this.loadUser());

  /** Controla la visibilidad del modal de sesión expirada */
  readonly sessionExpired = signal<boolean>(false);

  // ─── Timer de expiración ────────────────────────────────────
  private expirationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly http: HttpClient) {
    // Al iniciar la app (recarga de página), retomar el watcher si ya hay sesión
    const token = this.getToken();
    if (token) {
      this.startExpirationWatcher(token);
    }
  }

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
    this.clearExpirationWatcher();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  // ─── Sesión expirada ─────────────────────────────────────────
  /**
   * Activa el modal de sesión expirada.
   * Llamado tanto desde el interceptor HTTP (401) como desde el timer proactivo.
   */
  triggerSessionExpired(): void {
    // Evitar doble disparo si el modal ya está visible
    if (this.sessionExpired()) return;
    this.logout();
    this.sessionExpired.set(true);
  }

  /** Cierra el modal de sesión expirada */
  clearSessionExpired(): void {
    this.sessionExpired.set(false);
  }

  // ─── Token Watcher proactivo ─────────────────────────────────
  /**
   * Decodifica el campo `exp` del JWT y programa un setTimeout para activar
   * el modal exactamente cuando el token expire, sin necesidad de peticiones HTTP.
   */
  startExpirationWatcher(token: string): void {
    this.clearExpirationWatcher(); // Cancelar cualquier timer anterior

    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload['exp'] !== 'number') {
      console.warn('[AuthService] No se pudo leer exp del JWT. Watcher no iniciado.');
      return;
    }

    const expMs      = (payload['exp'] as number) * 1000; // exp está en segundos
    const nowMs      = Date.now();
    const remainingMs = expMs - nowMs;

    if (remainingMs <= 0) {
      // Token ya expirado al cargar
      this.triggerSessionExpired();
      return;
    }

    console.info(
      `[AuthService] Token expira en ${Math.round(remainingMs / 1000)}s. Watcher activado.`
    );

    this.expirationTimer = setTimeout(() => {
      console.info('[AuthService] Token expirado por timer. Mostrando modal.');
      this.triggerSessionExpired();
    }, remainingMs);
  }

  /** Cancela el timer de expiración en curso */
  private clearExpirationWatcher(): void {
    if (this.expirationTimer !== null) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
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
    // Iniciar el watcher proactivo con el nuevo token
    this.startExpirationWatcher(token);
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
