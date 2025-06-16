import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { COMMON_ID } from './const/list.const';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `list/${COMMON_ID.route}`,
    pathMatch: 'full',
  },
  {
    path: 'list/:listId',
    loadComponent: () => import('./components/item-list/item-list.component').then(m => m.ItemListComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
  },
  {
    path: '**',
    redirectTo: `list/${COMMON_ID.route}`,
  },
];
