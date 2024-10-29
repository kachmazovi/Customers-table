import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-view',
  standalone: true,
  imports: [NgClass],
  template: ` <p [ngClass]="type">{{ msg }}</p> `,
  styles: `
    p {
      height: 16px;
      font-size: 12px;
      margin-top: 4px;
    }

    .error {
      color: red;
    }

    .success {
      color: green;
    }
  `,
})
export class MessageViewComponent {
  @Input() msg!: string;
  @Input() type!: 'error' | 'success';
}
