import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { IdleService } from './core/services/idle.service';
import { SessionExpiredModalComponent } from './core/components/session-expired-modal/session-expired-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SessionExpiredModalComponent],
  template: `
    <router-outlet />
    @if (authService.sessionExpired()) {
      <app-session-expired-modal />
    }
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class App {
  readonly authService = inject(AuthService);
  // Inyección de IdleService para inicializar el tracking de inactividad reactivo
  readonly idleService = inject(IdleService);
}
