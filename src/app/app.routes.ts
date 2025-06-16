import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { COMMON_COLLECTION } from './const/list.const';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `collection/${COMMON_COLLECTION.route}`,
    pathMatch: 'full',
  },
  {
    path: 'collection/:collectionId',
    loadComponent: () => import('./components/item-list/item-list.component').then(m => m.ItemListComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
  },
  {
    path: '**',
    redirectTo: `collection/${COMMON_COLLECTION.route}`,
  },
];
