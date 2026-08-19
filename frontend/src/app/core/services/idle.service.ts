import { Injectable, NgZone, inject, OnDestroy, effect } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { AuthService } from './auth.service';

/** Tiempo de inactividad por defecto: 20 minutos (en milisegundos) */
export const DEFAULT_IDLE_TIMEOUT_MS = 20 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {
  private readonly ngZone      = inject(NgZone);
  private readonly authService = inject(AuthService);

  private idleTimeoutMs: number = DEFAULT_IDLE_TIMEOUT_MS;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private activitySubscription: Subscription | null = null;
  private isRunning = false;

  private readonly events: (keyof WindowEventMap)[] = [
    'mousemove',
    'keydown',
    'click',
    'scroll',
    'touchstart',
  ];

  constructor() {
    // Escucha reactiva con Signal: activa/desactiva según estado de sesión
    effect(() => {
      const user = this.authService.currentUser();
      const expired = this.authService.sessionExpired();

      if (user && !expired) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  /**
   * Configura e inicia la vigilancia de inactividad del usuario.
   * @param timeoutMs Duración en ms antes de considerar inactivo (default: 20m)
   */
  start(timeoutMs: number = DEFAULT_IDLE_TIMEOUT_MS): void {
    this.idleTimeoutMs = timeoutMs;
    this.stop(); // Limpia listeners o timers previos

    this.isRunning = true;
    this.resetTimer();

    // Registrar listeners fuera de Angular Zone para óptimo rendimiento
    this.ngZone.runOutsideAngular(() => {
      const eventStreams = this.events.map((eventName) =>
        fromEvent(window, eventName, { passive: true })
      );

      this.activitySubscription = merge(...eventStreams)
        .pipe(
          // Throttle de 1 segundo para evitar reiniciar el timer miles de veces en mousemove/scroll
          throttleTime(1000)
        )
        .subscribe(() => {
          if (this.isRunning) {
            this.resetTimer();
          }
        });
    });
  }

  /**
   * Detiene los listeners y temporizadores de inactividad para evitar fugas de memoria.
   */
  stop(): void {
    this.isRunning = false;
    this.clearTimer();
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      this.activitySubscription = null;
    }
  }

  /**
   * Reinicia el temporizador de inactividad.
   */
  private resetTimer(): void {
    this.clearTimer();

    this.idleTimer = setTimeout(() => {
      this.handleTimeout();
    }, this.idleTimeoutMs);
  }

  /**
   * Limpia el timeout activo.
   */
  private clearTimer(): void {
    if (this.idleTimer !== null) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  /**
   * Se ejecuta cuando expira el tiempo de inactividad del usuario.
   */
  private handleTimeout(): void {
    this.stop();
    // Reingresar a la zona de Angular para actualizar Signals y vista
    this.ngZone.run(() => {
      console.info('[IdleService] Tiempo de inactividad alcanzado. Disparando sesión expirada.');
      this.authService.triggerSessionExpired();
    });
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
