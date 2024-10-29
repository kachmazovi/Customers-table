import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];

  @Output() rowClick = new EventEmitter<any>();
}
