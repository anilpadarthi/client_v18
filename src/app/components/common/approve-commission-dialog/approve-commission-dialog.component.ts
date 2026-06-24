import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';


@Component({
  selector: 'app-approve-commission-dialog',
  templateUrl: './approve-commission-dialog.component.html',
  styleUrls: ['./approve-commission-dialog.component.scss']
})
export class ApproveCommissionDialogComponent implements OnInit {
  selectedFromMonth: string | null = null;
  selectedToMonth: string | null = null;
  commissionTypeHistory: any[] = [];

  displayedColumns: string[] = [
    'fromDate',
    'toDate',
    'type'
  ];

  constructor(
    public dialogRef: MatDialogRef<ApproveCommissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shopName: string, commissionTypeHistory?: any[] }
  ) { 

    this.commissionTypeHistory = data?.commissionTypeHistory || [];
  }

  ngOnInit(): void {
    this.selectedFromMonth = moment().subtract(2, 'months').format('YYYY-MM-01');
  }

  chosenYearHandler(normalizedYear: any): void {
    // No action required until month selection
  }

  chosenFromMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>): void {
    this.selectedFromMonth = moment(normalizedMonth).format('YYYY-MM-01');
    datepicker.close();
  }

  chosenToMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>): void {
    this.selectedToMonth = moment(normalizedMonth).format('YYYY-MM-01');
    datepicker.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApprove(): void {
    if (this.canApprove) {
      this.dialogRef.close({
        fromDate: this.selectedFromMonth,
        toDate: this.selectedToMonth
      });
    }
  }

  get canApprove(): boolean {
    return !!this.selectedFromMonth && !!this.selectedToMonth;
  }
}
