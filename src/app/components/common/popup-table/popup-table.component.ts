import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-table',
  templateUrl: './popup-table.component.html',
  styleUrl: './popup-table.component.scss'
})
export class PopupTableComponent {

  dataSource: any = [];
  displayedColumns: string[] = [];
  stickyColumns: string[] = ['Id', 'Name'];
  header = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.result.length > 0) {
      this.displayedColumns = Object.keys(data.result[0]);
      this.dataSource = data.result;
      this.header = data.headerName;
    }

  }

}
