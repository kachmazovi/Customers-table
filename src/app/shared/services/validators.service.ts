import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CustomersService } from './customers.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomDbCustomersService } from '../../core/services/custom-db-customers.service';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  constructor(
    private customerServ: CustomersService,
    private customersDb: CustomDbCustomersService
  ) {
    this.customerServ.getCustomers().subscribe();
  }

  public checkUsername(username: string): Observable<boolean> {
    return of(this.customersDb.customers).pipe(
      map((customers) => customers.some((c) => c.userName === username))
    );
  }

  public validate(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return this.checkUsername(control.value).pipe(
      map((isTaken) => (isTaken ? { usernameTaken: true } : null))
    );
  }

  public onlyLatinLetters(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[a-zA-Z]*$/;
    if (control.value && !pattern.test(control.value)) {
      return { onlyLatinLetters: true };
    }
    return null;
  }
}
