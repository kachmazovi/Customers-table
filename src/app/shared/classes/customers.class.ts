import { FormControl, FormGroup, Validators } from '@angular/forms';
import { gender } from '../interfaces/customer.interface';
import { CustomersService } from '../services/customers.service';
import { Observable, tap } from 'rxjs';
import { signal } from '@angular/core';
import { FORM_ERRORS, REGISTER_INPUTS } from '../constants';
import { ValidatorsService } from '../services/validators.service';

export abstract class Customers {
  public imgUrl = signal<string | null>(null);
  public inputs = REGISTER_INPUTS;
  public formErrors = FORM_ERRORS;

  public customerInfo = new FormGroup({
    userName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern('^[a-zA-Z0-9]*$'),
    ]),
    firstName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    lastName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ]),
    gender: new FormControl<string | null>('Male', [Validators.required]),
    personalId: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    phoneNumber: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
    address: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    profileImgId: new FormControl<string | null>(null),
  });

  constructor(
    protected customerServ: CustomersService,
    protected validator: ValidatorsService
  ) {
    this.addValidators();
  }

  public uploadImg(event: any): Observable<string> {
    const file = event.target.files[0];
    return this.customerServ
      .uploadProfileImage(file, this.profileImgId.value)
      .pipe(tap((url) => this.imgUrl.set(url)));
  }

  public remove(): void {
    this.customerServ
      .deleteProfileImg(this.profileImgId.value)
      .pipe(
        tap(() => {
          this.imgUrl.set(null);
        })
      )
      .subscribe();
  }

  private addValidators(): void {
    this.customerInfo
      .get('userName')
      ?.addAsyncValidators(this.validator.validate.bind(this.validator));
    this.customerInfo
      .get('firstName')
      ?.addValidators(this.validator.onlyLatinLetters);
    this.customerInfo
      .get('lastName')
      ?.addValidators(this.validator.onlyLatinLetters);
    this.customerInfo.get('userName')?.updateValueAndValidity();
    this.customerInfo.get('firstName')?.updateValueAndValidity();
    this.customerInfo.get('lastName')?.updateValueAndValidity();
  }

  public get userName(): FormControl<string> {
    return this.customerInfo.get('userName') as FormControl;
  }
  public get firstName(): FormControl<string> {
    return this.customerInfo.get('firstName') as FormControl;
  }
  public get lastName(): FormControl<string> {
    return this.customerInfo.get('lastName') as FormControl;
  }
  public get gender(): FormControl<gender> {
    return this.customerInfo.get('gender') as FormControl;
  }
  public get personalId(): FormControl<number> {
    return this.customerInfo.get('personalId') as FormControl;
  }
  public get phoneNumber(): FormControl<number> {
    return this.customerInfo.get('phoneNumber') as FormControl;
  }
  public get address(): FormControl<string> {
    return this.customerInfo.get('address') as FormControl;
  }
  public get profileImgId(): FormControl<string> {
    return this.customerInfo.get('profileImgId') as FormControl;
  }
}
