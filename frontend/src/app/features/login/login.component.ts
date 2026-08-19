import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly authSvc = inject(AuthService);
  private readonly router  = inject(Router);

  // ─── Estado ─────────────────────────────────────────────────
  readonly isLoading    = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly loggedUser   = signal<UserProfile | null>(null);
  readonly showPassword = signal(false);

  // ─── Formulario ─────────────────────────────────────────────
  readonly loginForm: FormGroup = this.fb.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
  });

  // ─── Getters para template ──────────────────────────────────
  get identifierCtrl() { return this.loginForm.get('identifier')!; }
  get passwordCtrl()   { return this.loginForm.get('password')!; }

  get identifierError(): string | null {
    const ctrl = this.identifierCtrl;
    if (!ctrl.touched || ctrl.valid) return null;
    if (ctrl.hasError('required'))   return 'El usuario o email es requerido.';
    if (ctrl.hasError('minlength'))  return 'Mínimo 3 caracteres.';
    return null;
  }

  get passwordError(): string | null {
    const ctrl = this.passwordCtrl;
    if (!ctrl.touched || ctrl.valid) return null;
    if (ctrl.hasError('required'))   return 'La contraseña es requerida.';
    if (ctrl.hasError('minlength'))  return 'Mínimo 6 caracteres.';
    return null;
  }

  // ─── Manejo de logo ─────────────────────────────────────────
  /** Reemplaza logo imagen con SVG cuando el PNG no carga */
  logoFallback(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Ocultar la imagen rota y mostrar el contenedor de fallback
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      const svgDiv = document.createElement('div');
      svgDiv.className = 'logo-icon';
      svgDiv.setAttribute('aria-hidden', 'true');
      svgDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      `;
      parent.insertBefore(svgDiv, img);
    }
  }

  // ─── Acciones ───────────────────────────────────────────────
  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { identifier, password } = this.loginForm.value as {
      identifier: string;
      password:   string;
    };

    this.authSvc.login({ identifier, password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.loggedUser.set(response.data.user);
        // Redirigir al dashboard tras login exitoso
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  onLogout(): void {
    this.authSvc.logout();
    this.loggedUser.set(null);
    this.loginForm.reset();
    this.errorMessage.set(null);
  }
}
