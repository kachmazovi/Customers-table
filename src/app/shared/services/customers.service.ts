import { Injectable, signal } from '@angular/core';
import { FirebaseRestService } from '../../core/services/firebase.rest.service';
import { finalize, map, Observable, switchMap, tap } from 'rxjs';
import {
  ICustomer,
  IFilteredCustomers,
} from '../interfaces/customer.interface';
import { Router } from '@angular/router';
import { CryptoJSService } from '../../core/services/crypto-js.service';
import { CustomDbCustomersService } from '../../core/services/custom-db-customers.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  public showSpinner = signal(false);
  public currentUser = signal<null | ICustomer>(null);

  constructor(
    private firebaseRest: FirebaseRestService,
    private customersDB: CustomDbCustomersService,
    private cryptoJs: CryptoJSService,
    private router: Router
  ) {
    this.currentUser.set(
      this.cryptoJs.getFromLocalStorageAndDecrypt('currentUser')
    );
  }

  public login(
    userName: string,
    password: string
  ): Observable<ICustomer | undefined> {
    this.showSpinner.set(true);
    return this.getCustomers().pipe(
      map((customers) =>
        customers.find(
          (customer) =>
            customer.userName === userName && customer.password === password
        )
      ),
      tap((currentUser) => {
        if (currentUser) {
          this.currentUser.set(currentUser);
          this.cryptoJs.encryptAndSaveToLocalStorage(
            'currentUser',
            currentUser
          );
          this.router.navigate(['customers']);
        }
        this.showSpinner.set(false);
      })
    );
  }

  public registerCustomer(customerData: ICustomer) {
    this.showSpinner.set(true);
    return this.firebaseRest
      .register(customerData)
      .pipe(finalize(() => this.showSpinner.set(false)));
  }

  public getCustomers(): Observable<ICustomer[]> {
    return this.firebaseRest.customers().pipe(
      tap((customers) => {
        this.customersDB.customers = customers;
      })
    );
  }

  public uploadProfileImage(file: File, imgId: string): Observable<string> {
    this.showSpinner.set(true);
    return this.firebaseRest.uploadProfileImage(file, imgId).pipe(
      switchMap(() => {
        return this.getProfileImage(imgId);
      }),
      finalize(() => this.showSpinner.set(false))
    );
  }

  public getProfileImage(imgId: string): Observable<string> {
    return this.firebaseRest.getProfileImage(imgId);
  }

  public deleteProfileImg(imgId: string): Observable<any> {
    this.showSpinner.set(true);
    return this.firebaseRest
      .removeProfileImage(imgId)
      .pipe(finalize(() => this.showSpinner.set(false)));
  }

  public getFilteredCustomers(
    filter: any,
    lastCustomerId?: string
  ): Observable<IFilteredCustomers> {
    return this.firebaseRest.getFilteredCustomers(filter, lastCustomerId);
  }

  public getCustomer(id: string): Observable<ICustomer> {
    return this.firebaseRest.getCustomer(id);
  }
}
