import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { CustomersService } from '../shared/services/customers.service';
import { ICustomer } from '../shared/interfaces/customer.interface';
import { MessageViewComponent } from '../shared/components/message-view/message-view.component';
import { RegisterFormComponent } from '../shared/components/register-form/register-form.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    MatIconModule,
    MessageViewComponent,
    RegisterFormComponent,
  ],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss',
})
export class CustomerRegisterComponent {
  constructor(private router: Router, private customerServ: CustomersService) {
    localStorage.removeItem('currentUser');
  }

  public register(customerInfo: ICustomer): void {
    this.customerServ
      .registerCustomer(customerInfo)
      .pipe(tap(() => this.router.navigate(['login'])))
      .subscribe();
  }
}
