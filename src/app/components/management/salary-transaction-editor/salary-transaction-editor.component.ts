import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagementService } from '../../../services/management.service';
import { ToasterService } from '../../../services/toaster.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { cleanDate } from '../../../helpers/utils';


@Component({
  selector: 'app-salary-transaction-editor',
  templateUrl: './salary-transaction-editor.component.html',
  styleUrl: './salary-transaction-editor.component.scss'
})

export class SalaryTransactionEditorComponent {

  salaryInAdvanceForm: FormGroup;
  areaId: any;

  constructor
    (
      @Inject(MAT_DIALOG_DATA) public data: any,
      private managementService: ManagementService,
      private toasterService: ToasterService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<SalaryTransactionEditorComponent>
    ) {

    this.salaryInAdvanceForm = this.fb.group(
      {
        userSalaryTransactionID: this.data.userSalaryTransactionID,
        amount: [this.data.amount, [Validators.required]],
        type: [this.data.type, [Validators.required]],
        transactionDate: [this.data.transactionDate],
        comments: [this.data.comments],
        userId: this.data.userId
      },
    );
  }

  ngOnInit(): void {
  }

  onSave() {
    if (this.salaryInAdvanceForm.valid) {
      const requestBody = {
        userSalaryTransactionID: this.salaryInAdvanceForm.value.userSalaryTransactionID,
        amount: this.salaryInAdvanceForm.value.amount,
        transactionDate: cleanDate(this.salaryInAdvanceForm.value.transactionDate),
        type: this.salaryInAdvanceForm.value.type,
        comments: this.salaryInAdvanceForm.value.comments,
        userId: this.salaryInAdvanceForm.value.userId,

      };
      if (this.data.userSalaryTransactionID) {

        this.managementService.updateUserSalaryTransaction(requestBody).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Updated successfully.");
            this.dialogRef.close(true);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
      else {
        this.managementService.createUserSalaryTransaction(requestBody).subscribe((res) => {
          if (res.statusCode == 201) {
            this.toasterService.showMessage("Created successfully.");
            this.dialogRef.close(true);
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }

    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
