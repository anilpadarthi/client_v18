
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-supplier-transaction-editor',
  templateUrl: './supplier-transaction-editor.component.html',
  styleUrl: './supplier-transaction-editor.component.scss'
})

export class SupplierTransactionEditorComponent {

  supplierTransactionForm: FormGroup;
  referenceImagePreview: any = null;
  paymentId: any = null;
  orderId: any = null;
  shopId: any = null;
  paymentType = '';
  IsDisabled = false;
  supplierLookup: any[] = [];
  balanceAmount = 0.00;
  commissionWalletAmount = 0.00;
  bonusWalletAmount = 0.00;
  instantBonusWalletAmount = 0.00;
  selectedOption: any = '';
  isAdmin = false;
  isLoading = false;

  constructor
    (
      @Inject(MAT_DIALOG_DATA) public data: any,
      private supplierService: SupplierService,
      private toasterService: ToasterService,
      private lookupService: LookupService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<SupplierTransactionEditorComponent>,
    ) {


    this.supplierTransactionForm = this.fb.group(
      {
        supplierId: [null, [Validators.required]],
        transactionType: [null, [Validators.required]],
        amount: [null, [Validators.required]],
        referenceNumber: [null],
        transactionDate: [''],
      },
    );
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }  

  loadSuppliers() {
    this.lookupService.getSuppliers().subscribe((res) => {
      this.supplierLookup = res.data;
    });
  } 

  onSave() {
    if (this.supplierTransactionForm.valid) {      
      this.isLoading = true;
      this.supplierService.createTransaction(this.supplierTransactionForm.value).subscribe((res) => {
        if (res.statusCode == 201) {
          this.toasterService.showMessage("Saved successfully.");
          this.dialogRef.close({ event: 'Cancel' });
        }
        else {
          this.toasterService.showMessage(res.message);
        }
        this.isLoading = false;
      });

    }
  }

  onCancel(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  

}
