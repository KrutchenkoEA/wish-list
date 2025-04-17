import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/item-list/item-list.component').then(m => m.ItemListComponent),
  },
  {
    path: 'admin',
    canActivate: [() => inject(AuthService).isAdmin()],
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
