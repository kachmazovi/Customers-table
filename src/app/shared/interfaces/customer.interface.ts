export interface ICustomer {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: gender;
  personalId: number;
  phoneNumber: number;
  address: string;
  profileImgId: string;
}

export type gender = 'Male' | 'Female';

export interface ICustomersFilter {
  city: string | 'all';
  gender: 'Male' | 'Female' | 'all';
  search: string;
  orderBy: 'asc' | 'desc';
}

export interface IFilteredCustomers {
  customers: ICustomer[];
  isMore: boolean;
  lastCustomerId: string;
}
