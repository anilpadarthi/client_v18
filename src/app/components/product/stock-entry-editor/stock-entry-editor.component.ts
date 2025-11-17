import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagementService } from '../../../services/management.service';
import { ToasterService } from '../../../services/toaster.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'app-stock-entry-editor',
  templateUrl: './stock-entry-editor.component.html',
  styleUrl: './stock-entry-editor.component.scss'
})

export class StockEntryEditorComponent {

  stockEntryForm: FormGroup;
  areaId: any;

  constructor
    (
      @Inject(MAT_DIALOG_DATA) public data: any,
      private managementService: ManagementService,
      private toasterService: ToasterService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<StockEntryEditorComponent>
    ) {

    this.stockEntryForm = this.fb.group(
      {
        InventoryId: this.data.inventoryId,        
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
    if (this.stockEntryForm.valid) {
      if (this.data.userSalaryTransactionID) {

        this.managementService.updateUserSalaryTransaction(this.stockEntryForm.value).subscribe((res) => {
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
        this.managementService.createUserSalaryTransaction(this.stockEntryForm.value).subscribe((res) => {
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
