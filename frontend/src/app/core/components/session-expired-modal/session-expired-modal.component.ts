import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  templateUrl: './session-expired-modal.component.html',
  styleUrls: ['./session-expired-modal.component.css'],
})
export class SessionExpiredModalComponent {
  private readonly router      = inject(Router);
  private readonly authService = inject(AuthService);

  onAccept(): void {
    this.authService.clearSessionExpired();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
