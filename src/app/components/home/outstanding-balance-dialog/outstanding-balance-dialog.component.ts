import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-outstanding-balance-dialog',
  templateUrl: './outstanding-balance-dialog.component.html',
  styleUrls: ['./outstanding-balance-dialog.component.scss']
})
export class OutstandingBalanceDialogComponent {
  title: string;
  message: string;
  amount: number;

  constructor(
    public dialogRef: MatDialogRef<OutstandingBalanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; amount: number }
  ) {
    this.title = data.title;
    this.message = data.message;
    this.amount = data.amount;
  }

  close(): void {
    this.dialogRef.close();
  }
}
