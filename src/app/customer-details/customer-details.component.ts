import { Component, signal } from '@angular/core';
import { Customers } from '../shared/classes/customers.class';
import { CustomersService } from '../shared/services/customers.service';
import { ValidatorsService } from '../shared/services/validators.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs';
import { ICustomer } from '../shared/interfaces/customer.interface';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss',
})
export class CustomerDetailsComponent {
  public customer = signal<ICustomer>({} as ICustomer);
  public imgUrl = signal<string>('');

  constructor(
    private customerServ: CustomersService,
    private route: ActivatedRoute
  ) {
    this.getCustomer();
  }

  public getCustomer(): void {
    this.route.data
      .pipe(
        switchMap((data) => {
          this.customer.set(data['customer']);
          return this.customerServ.getProfileImage(
            data['customer'].profileImgId
          );
        }),
        catchError(() => this.customerServ.getProfileImage('default.jpg')),
        tap((imgUrl) => this.imgUrl.set(imgUrl))
      )
      .subscribe();
  }
}
