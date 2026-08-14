import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
