import { Component, HostListener, inject, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, switchMap, takeUntil, tap } from 'rxjs';
import { ICustomer } from '../shared/interfaces/customer.interface';
import { DestroyableComponent } from '../shared/components/destroyable/destroyable.component';
import { TableComponent } from '../shared/components/table/table.component';
import { CustomFilterComponent } from '../shared/components/custom-filter/custom-filter.component';
import {
  citiesOptions,
  gendersOptions,
  orderByOptions,
} from '../shared/constants';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CustomersService } from '../shared/services/customers.service';
import { CryptoJSService } from '../core/services/crypto-js.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterFormComponent } from '../shared/components/register-form/register-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [TableComponent, CustomFilterComponent, ReactiveFormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
})
export class CustomerListComponent
  extends DestroyableComponent
  implements OnInit
{
  @HostListener('document:scroll', ['$event'])
  onScroll(): void {
    if (
      this.isMore &&
      window.innerHeight + window.scrollY >= document.body.scrollHeight
    ) {
      this.customerServ.showSpinner.set(true);
      this.$lastCustomerId.next(this.lastCustomerId);
    }
  }

  public customers: ICustomer[] = [];
  public cities = citiesOptions;
  public genders = gendersOptions;
  public orderBy = orderByOptions;

  private isMore = false;
  private lastCustomerId!: string | undefined;
  private $lastCustomerId = new BehaviorSubject<string | undefined>(undefined);
  private dialog = inject(MatDialog);

  public filterControlsGroup = new FormGroup({
    city: new FormControl('all'),
    gender: new FormControl('all'),
    search: new FormControl(''),
    orderBy: new FormControl('asc'),
  });

  constructor(
    private customerServ: CustomersService,
    private cryptoJs: CryptoJSService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.getFilterProps();
    this.getCustomersFromRoute();
  }

  ngOnInit(): void {
    this.getMoreCustomers();
    this.filterCustomers();
  }

  public addCustomer() {
    this.dialog.open(RegisterFormComponent);
  }

  public goToCustomer({ profileImgId }: ICustomer) {
    this.customerServ.showSpinner.set(true);
    this.router
      .navigate(['customer', profileImgId])
      .finally(() => this.customerServ.showSpinner.set(false));
  }

  private getCustomersFromRoute() {
    this.route.data
      .pipe(
        takeUntil(this.$destroy),
        tap((data) => {
          this.customers = data['customers'];
          this.getCurrentUser();
        })
      )
      .subscribe();
  }

  private filterCustomers(lastCustomerId?: string): void {
    this.filterControlsGroup.valueChanges
      .pipe(
        takeUntil(this.$destroy),
        debounceTime(500),
        switchMap((filter) => {
          this.customerServ.showSpinner.set(true);
          this.cryptoJs.encryptAndSaveToLocalStorage(
            'filterControlsGroup',
            filter
          );
          return this.customerServ.getFilteredCustomers(filter, lastCustomerId);
        }),
        tap((filteredCustomers) => {
          this.customers = filteredCustomers.customers;
          this.getCurrentUser();
          this.isMore = filteredCustomers.isMore;
          this.lastCustomerId = filteredCustomers.lastCustomerId;
          window.scrollTo(0, 0);
          this.customerServ.showSpinner.set(false);
        })
      )
      .subscribe();
  }

  private getMoreCustomers(): void {
    this.$lastCustomerId
      .pipe(
        takeUntil(this.$destroy),
        switchMap((lastCustomerId) =>
          this.customerServ.getFilteredCustomers(
            this.filterControlsGroup.value,
            lastCustomerId
          )
        ),
        tap((filteredCustomers) => {
          this.customers = [...this.customers, ...filteredCustomers.customers];
          this.getCurrentUser();
          this.isMore = filteredCustomers.isMore;
          this.lastCustomerId = filteredCustomers.lastCustomerId;
          this.customerServ.showSpinner.set(false);
        })
      )
      .subscribe();
  }

  private getCurrentUser() {
    const index = this.customers.findIndex(
      (customer) =>
        customer.profileImgId === this.customerServ.currentUser()?.profileImgId
    );
    if (index !== -1) this.customers.splice(index, 1);
    this.customers.unshift(this.customerServ.currentUser() as ICustomer);
  }

  private getFilterProps() {
    const filter = this.cryptoJs.getFromLocalStorageAndDecrypt(
      'filterControlsGroup'
    );
    if (filter) {
      this.filterControlsGroup.setValue(filter);
    }
  }
}
