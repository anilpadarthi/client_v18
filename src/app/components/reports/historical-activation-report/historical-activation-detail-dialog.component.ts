import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-historical-activation-detail-dialog',
  templateUrl: './historical-activation-detail-dialog.component.html',
  styleUrls: ['./historical-activation-detail-dialog.component.scss']
})
export class HistoricalActivationDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HistoricalActivationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  keys(): string[] {
    return this.data ? Object.keys(this.data) : [];
  }

  close(): void {
    this.dialogRef.close();
  }
}
