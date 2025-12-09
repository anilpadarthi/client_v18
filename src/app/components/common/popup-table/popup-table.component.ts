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
    this.header = data.headerName;
    if (data.result.length > 0) {
      this.displayedColumns = Object.keys(data.result[0]);
      this.dataSource = data.result;
    }
  }

  isDate(value: any): boolean {
    if (!value) return false;

    // If value is number → NOT a date
    if (typeof value === 'number') return false;

    // Accept only strings that look like a date
    if (typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }

    return false;
  }

  convertToDate(value: any): Date {
    return new Date(value);
  }

  // Apply date format to a column
  // formatDate(value: any): string {
  //   return this.isDate(value) ? this.datePipe.transform(value, 'yyyy-MM-dd') : value;
  // }


}
