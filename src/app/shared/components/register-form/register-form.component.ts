import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Customers } from '../../classes/customers.class';
import { CustomersService } from '../../services/customers.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageViewComponent } from '../message-view/message-view.component';
import { MatIconModule } from '@angular/material/icon';
import { v4 } from 'uuid';
import { ICustomer } from '../../interfaces/customer.interface';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MessageViewComponent,
    MatIconModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent extends Customers {
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(): void {
    this.registerCustomer();
  }

  @Input() showLoginButton = false;
  @Output() register = new EventEmitter<ICustomer>();

  private dialog = inject(MatDialog);

  constructor(
    protected override customerServ: CustomersService,
    protected override validator: ValidatorsService,
    public router: Router
  ) {
    super(customerServ, validator);
    this.profileImgId.setValue(v4());
  }

  public upload(event: any): void {
    this.uploadImg(event).subscribe();
  }

  public registerCustomer(): void {
    if (this.customerInfo.valid) {
      if (this.router.url === '/register') {
        this.register.emit(this.customerInfo.value as ICustomer);
      } else if (this.router.url === '/customers') {
        this.customerServ
          .registerCustomer(this.customerInfo.value as ICustomer)
          .pipe(
            tap(() => {
              this.dialog.closeAll();
            }),
            switchMap(() => this.customerServ.getCustomers())
          )
          .subscribe();
      }
    }
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
