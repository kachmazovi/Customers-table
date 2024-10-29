import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomersService } from '../../shared/services/customers.service';

export const userLoggedGuard: CanActivateFn = () => {
  const customerServ = inject(CustomersService);
  const router = inject(Router);
  if (!!!customerServ.currentUser() && !!!localStorage.getItem('currentUser'))
    router.navigate(['/login']);
  return !!customerServ.currentUser() && !!localStorage.getItem('currentUser');
};
