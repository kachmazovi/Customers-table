import { Injectable } from '@angular/core';
import {
  ICustomer,
  ICustomersFilter,
  IFilteredCustomers,
} from '../../shared/interfaces/customer.interface';
import { delay, Observable, of } from 'rxjs';
import { customersDefaultFilter } from '../../shared/constants';

@Injectable({
  providedIn: 'root',
})
export class CustomDbCustomersService {
  public customers!: ICustomer[];
  private defaultFilter = customersDefaultFilter as ICustomersFilter;

  public getFilteredCustomers(
    filter = this.defaultFilter,
    lastCustomerId?: string
  ): Observable<IFilteredCustomers> {
    const { city, gender, search, orderBy } = filter;
    let filteredCustomers: ICustomer[] = [...this.customers];
    let isMore: boolean;

    filteredCustomers.sort((a, b) => {
      if (orderBy === 'asc') {
        return a.firstName.localeCompare(b.firstName);
      }
      return b.firstName.localeCompare(a.firstName);
    });

    filteredCustomers = search?.length
      ? this.getCustomersBySearch(filteredCustomers, search)
      : filteredCustomers;
    filteredCustomers =
      city !== 'all'
        ? this.getCustomersByCity(filteredCustomers, city)
        : filteredCustomers;
    filteredCustomers =
      gender !== 'all'
        ? this.getCustomersByGender(filteredCustomers, gender)
        : filteredCustomers;

    if (lastCustomerId) {
      const lastCustomerIndex = filteredCustomers.findIndex(
        (customer) => customer.profileImgId === lastCustomerId
      );
      isMore = filteredCustomers[lastCustomerIndex + 11] ? true : false;

      filteredCustomers = filteredCustomers.slice(
        lastCustomerIndex + 1,
        lastCustomerIndex + 11
      );
    } else {
      isMore = filteredCustomers.length > 30;
      filteredCustomers = filteredCustomers.slice(0, 30);
    }

    return of({
      customers: filteredCustomers,
      isMore,
      lastCustomerId:
        filteredCustomers[filteredCustomers.length - 1]?.profileImgId,
    }).pipe(delay(1000));
  }

  private getCustomersBySearch(
    customers: ICustomer[],
    search: ICustomersFilter['search']
  ): ICustomer[] {
    return customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        customer.userName.toLowerCase().includes(search.toLowerCase())
    );
  }

  private getCustomersByCity(
    customers: ICustomer[],
    city: ICustomersFilter['city']
  ): ICustomer[] {
    return customers.filter((customer) =>
      customer.address.toLocaleLowerCase().includes(city.toLocaleLowerCase())
    );
  }

  private getCustomersByGender(
    customers: ICustomer[],
    gender: ICustomersFilter['gender']
  ): ICustomer[] {
    return customers.filter((customer) => customer.gender === gender);
  }
}
