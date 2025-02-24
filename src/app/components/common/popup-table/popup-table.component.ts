import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {
    if (data.result.length > 0) {
      this.displayedColumns = Object.keys(data.result[0]);
      this.dataSource = data.result;
      this.header = data.headerName;
    }    
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

  // Apply date format to a column
  formatDate(value: any): string {
    return this.isDate(value) ? this.datePipe.transform(value, 'yyyy-MM-dd') : value;
  }


}
