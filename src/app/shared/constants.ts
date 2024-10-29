export const LOGIN_INPUTS = [
  {
    type: 'text',
    formControl: 'userName',
    placeholder: 'Username',
    id: 'userName',
  },
  {
    type: 'password',
    formControl: 'password',
    placeholder: 'Password',
    id: 'password',
  },
];

export const REGISTER_INPUTS = [
  {
    type: 'text',
    formControl: 'userName',
    placeholder: 'Username',
  },
  {
    type: 'password',
    formControl: 'password',
    placeholder: 'Password',
  },
  {
    type: 'text',
    formControl: 'firstName',
    placeholder: 'First Name',
  },
  {
    type: 'text',
    formControl: 'lastName',
    placeholder: 'Last Name',
  },
  {
    type: 'number',
    formControl: 'personalId',
    placeholder: 'Personal ID',
  },
  {
    type: 'number',
    formControl: 'phoneNumber',
    placeholder: 'Phone Number',
  },
  {
    type: 'text',
    formControl: 'address',
    placeholder: 'Address',
  },
];

export const FORM_ERRORS = [
  {
    type: 'required',
    msg: 'This field is required',
  },
  {
    type: 'minlength',
    msg: 'Min length is ',
  },
  {
    type: 'maxlength',
    msg: 'Max length is ',
  },
  {
    type: 'pattern',
    msg: 'Only letters and numbers are allowed.',
  },
  {
    type: 'usernameTaken',
    msg: 'Username is already taken',
  },
  {
    type: 'onlyLatinLetters',
    msg: 'Only latin letters are allowed',
  },
];

export const citiesOptions = [
  {
    value: 'all',
    name: 'All',
  },
  {
    value: 'tbilisi',
    name: 'Tbilisi',
  },
  {
    value: 'batumi',
    name: 'Batumi',
  },
  {
    value: 'kutaisi',
    name: 'Kutaisi',
  },
];

export const gendersOptions = [
  {
    value: 'all',
    name: 'All',
  },
  {
    value: 'Male',
    name: 'Male',
  },
  {
    value: 'Female',
    name: 'Female',
  },
];

export const orderByOptions = [
  {
    value: 'asc',
    name: 'Ascending',
  },
  {
    value: 'desc',
    name: 'Descending',
  },
];

export const customersDefaultFilter = {
  city: 'all',
  gender: 'all',
  search: '',
  orderBy: 'asc',
};
