import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';

export const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'login', component: LoginComponent },
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  // },
  { path: '**', redirectTo: '' }
];
