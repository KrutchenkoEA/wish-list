import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getAdminStatus()) {
    return true;
  } else {
    router.navigate(['/']); // или можно показать сообщение
    return false;
  }
};
