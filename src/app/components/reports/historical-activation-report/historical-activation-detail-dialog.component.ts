import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-historical-activation-detail-dialog',
  templateUrl: './historical-activation-detail-dialog.component.html',
  styleUrls: ['./historical-activation-detail-dialog.component.scss']
})
export class HistoricalActivationDetailDialogComponent implements OnInit {
  dataSource: any = [];
  displayedColumns: string[] = [];
  stickyColumns: string[] = [];
  header = '';
  isMobile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {
    this.header = data.headerName;
    if (data.result.length > 0) {
      this.displayedColumns = Object.keys(data.result[0]).filter(col => col !== 'Id');
      this.dataSource = data.result;
    }
  }

  ngOnInit(): void {
    this.checkIfMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    this.stickyColumns = this.isMobile ? [] : ['Name'];
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

  getTotal(column: string): any {
    if (column == 'Id') {
      return "";
    }
    else if (column == 'Name') {
      return "Total";
    }
    return this.dataSource.reduce((sum: any, item: any) => sum + Number(item[column]), 0)
  }

  getCellClass(value: number): string {
    if (value > 10) return 'green-cell';
    if (value >= 5) return 'yellow-cell';
    if (value < 5) return 'red-cell';
    return '';
  }

}

