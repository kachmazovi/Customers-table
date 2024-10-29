import { Component, HostListener, signal } from '@angular/core';
import { LOGIN_INPUTS } from '../shared/constants';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { CustomersService } from '../shared/services/customers.service';
import { DestroyableComponent } from '../shared/components/destroyable/destroyable.component';
import { takeUntil, tap } from 'rxjs';
import { MessageViewComponent } from '../shared/components/message-view/message-view.component';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, MessageViewComponent],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss',
})
export class CustomerLoginComponent extends DestroyableComponent {
  @HostListener('document:keydown.enter', ['$event'])
  registerUser(): void {
    if (this.userForm.valid) {
      this.login();
    }
  }

  public inputs = LOGIN_INPUTS;
  public loginFailed = signal(false);

  public userForm = new FormGroup({
    userName: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  constructor(private customerServ: CustomersService) {
    super();
    localStorage.removeItem('currentUser');

    this.userForm.valueChanges
      .pipe(
        takeUntil(this.$destroy),
        tap(() => this.loginFailed.set(false))
      )
      .subscribe();
  }

  public login() {
    const { userName, password } = this.userForm.value;
    this.customerServ
      .login(userName as string, password as string)
      .pipe(
        takeUntil(this.$destroy),
        tap(() => this.loginFailed.set(!!!this.customerServ.currentUser()))
      )
      .subscribe();
  }
}
