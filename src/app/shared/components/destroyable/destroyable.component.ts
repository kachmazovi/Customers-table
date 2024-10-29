import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-destroyable',
  standalone: true,
  imports: [],
  template: ``,
})
export class DestroyableComponent implements OnDestroy {
  public $destroy = new Subject<void>();

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
