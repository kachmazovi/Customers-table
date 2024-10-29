import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { CustomersService } from './shared/services/customers.service';
import { inject } from '@angular/core';
import { userLoggedGuard } from './core/guards/user-logged.guard';
import { CustomDbCustomersService } from './core/services/custom-db-customers.service';
import { map, switchMap } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./customer-login/customer-login.component').then(
        (c) => c.CustomerLoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./customer-register/customer-register.component').then(
        (c) => c.CustomerRegisterComponent
      ),
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./customer-list/customer-list.component').then(
        (c) => c.CustomerListComponent
      ),
    canActivate: [userLoggedGuard],
    resolve: {
      customers: () => {
        const customerServ = inject(CustomersService);
        const customersDB = inject(CustomDbCustomersService);
        return customerServ.getCustomers().pipe(
          switchMap(() => customersDB.getFilteredCustomers()),
          map((customers) => customers.customers)
        );
      },
    },
  },
  {
    path: 'customer/:id',
    loadComponent: () =>
      import('./customer-details/customer-details.component').then(
        (c) => c.CustomerDetailsComponent
      ),
    canActivate: [userLoggedGuard],
    resolve: {
      customer: (route: ActivatedRouteSnapshot) => {
        const customerServ = inject(CustomersService);
        return customerServ.getCustomer(route.params['id'] as string);
      },
    },
  },
  {
    path: '**',
    redirectTo: 'customers',
    pathMatch: 'full',
  },
];
