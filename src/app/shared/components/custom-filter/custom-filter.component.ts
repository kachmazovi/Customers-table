import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './custom-filter.component.html',
  styleUrl: './custom-filter.component.scss',
})
export class CustomFilterComponent {
  @Input() firstSelectOptions: { value: string; name: string }[] = [];
  @Input() firstSelectControl: FormControl = new FormControl();
  @Input() secondSelectOptions: { value: string; name: string }[] = [];
  @Input() secondSelectControl: FormControl = new FormControl();
  @Input() thirdSelectOptions: { value: string; name: string }[] = [];
  @Input() thirdSelectControl: FormControl = new FormControl();
  @Input() inputControl: FormControl = new FormControl();
  @Input() placeholder = '';
  @Output() addCustomer = new EventEmitter<void>();

  public reset() {
    this.firstSelectControl.setValue(this.firstSelectOptions[0].value);
    this.secondSelectControl.setValue(this.secondSelectOptions[0].value);
    this.thirdSelectControl.setValue(this.thirdSelectOptions[0].value);
    this.inputControl.setValue('');
  }
}
