import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  id:    string;
  label: string;
  route: string;
  icon:  string; // SVG path data
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent {
  private readonly authSvc = inject(AuthService);
  private readonly router  = inject(Router);

  readonly currentUser   = this.authSvc.currentUser;
  readonly sidebarOpen   = signal(false);
  readonly logoError     = signal(false);

  readonly navItems: NavItem[] = [
    {
      id:    'nav-dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      icon:  'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    },
    {
      id:    'nav-gastos',
      label: 'Gastos',
      route: '/dashboard/gastos',
      icon:  'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 0v20M12 8v8m-4-4h8',
    },
    {
      id:    'nav-categorias',
      label: 'Categorías',
      route: '/dashboard/categorias',
      icon:  'M4 6h16M4 10h16M4 14h16M4 18h16',
    },
    {
      id:    'nav-presupuestos',
      label: 'Presupuestos',
      route: '/dashboard/presupuestos',
      icon:  'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z',
    },
    {
      id:    'nav-reportes',
      label: 'Reportes',
      route: '/dashboard/reportes',
      icon:  'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z',
    },
    {
      id:    'nav-usuarios',
      label: 'Usuarios',
      route: '/dashboard/usuarios',
      icon:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm11 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  onLogoError(): void {
    this.logoError.set(true);
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  get userInitial(): string {
    const username = this.currentUser()?.username ?? 'U';
    return username.charAt(0).toUpperCase();
  }
}
