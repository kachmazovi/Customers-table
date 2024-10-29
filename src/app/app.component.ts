import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { CustomersService } from './shared/services/customers.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomerLoginComponent, CustomerRegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'customers';

  constructor(public customerServ: CustomersService) {}
}
