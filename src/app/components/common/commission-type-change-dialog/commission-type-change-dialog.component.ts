import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-commission-type-change-dialog',
  templateUrl: './commission-type-change-dialog.component.html',
  styleUrls: ['./commission-type-change-dialog.component.scss']
})
export class CommissionTypeChangeDialogComponent {
  commissionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CommissionTypeChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { shopId: number },
    private fb: FormBuilder
  ) {
    this.commissionForm = this.fb.group({
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      isMobileShop:false
    });
  }

  onSave(): void {
    if (this.commissionForm.valid) {
      const formData = {
        shopId: this.data.shopId,
        fromDate: this.commissionForm.value.fromDate,
        toDate: this.commissionForm.value.toDate,
        isMobileShop : this.commissionForm.value.isMobileShop ? 1 : 0,
        loggedInUserId: 1, // Replace with actual logged-in user ID
      };
      this.dialogRef.close(formData);
    }
  }

  // Handle Year Selection (no action needed)
    chosenYearHandler(normalizedYear: any) {
      // No action required, just wait for month selection
    }
  
    // Handle Month Selection
    chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
      const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
      this.commissionForm.patchValue({ fromDate: formattedMonth + "-01" });
      datepicker.close(); // Close picker after selection
    }

      choseToMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
        const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
       this.commissionForm.patchValue({ toDate: formattedMonth + "-01" });
        datepicker.close(); // Close picker after selection
      }
}