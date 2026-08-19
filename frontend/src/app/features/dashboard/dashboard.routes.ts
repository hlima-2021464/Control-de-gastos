import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';
import { roleGuard } from '../../core/guards/role.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../shared/components/under-construction/under-construction.component').then(
            (m) => m.UnderConstructionComponent
          ),
        title: 'Dashboard — Control de Gastos',
      },
      {
        path: 'gastos',
        loadComponent: () =>
          import('../../shared/components/under-construction/under-construction.component').then(
            (m) => m.UnderConstructionComponent
          ),
        title: 'Gastos — Control de Gastos',
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('../../shared/components/under-construction/under-construction.component').then(
            (m) => m.UnderConstructionComponent
          ),
        title: 'Categorías — Control de Gastos',
      },
      {
        path: 'presupuestos',
        loadComponent: () =>
          import('../../shared/components/under-construction/under-construction.component').then(
            (m) => m.UnderConstructionComponent
          ),
        title: 'Presupuestos — Control de Gastos',
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('../../shared/components/under-construction/under-construction.component').then(
            (m) => m.UnderConstructionComponent
          ),
        title: 'Reportes — Control de Gastos',
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () =>
          import('../../shared/components/under-construction/under-construction.component').then(
            (m) => m.UnderConstructionComponent
          ),
        title: 'Usuarios — Control de Gastos',
      },
    ],
  },
];
