
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from '../../../services/shop.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { OnFieldService } from '../../../services/on-field.service';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { WebstorgeService } from '../../../services/web-storage.service';

@Component({
  selector: 'app-shop-address-details',
  templateUrl: './shop-address-details.component.html',
  styleUrl: './shop-address-details.component.scss'
})

export class ShopAddressDetailsComponent {

  shopDetailsForm: FormGroup;
  referenceImagePreview: any = null;
  paymentId: any = null;
  orderId: any = null;
  shopId: any = null;
  paymentType = '';
  IsDisabled = false;
  availableCommissionChequeNumbers: any[] = [];
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
      private shopService: ShopService,
      private toasterService: ToasterService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<ShopAddressDetailsComponent>,
    ) {

    this.shopDetailsForm = this.fb.group(
      {
        shopId: [this.data.shopId, [Validators.required]],
        shopName: [this.data.shopName, [Validators.required]],
        shopOwnerName: [this.data.shopOwnerName, [Validators.required]],
        shopEmail: [this.data.shopEmail, [Validators.required]],
        shopPhone: [this.data.shopPhone, [Validators.required]],
        addressLine1: [this.data.addressLine1, [Validators.required]],
        addressLine2: [this.data.addressLine2],
        deliveryInstructions: [this.data.deliveryInstructions],
      },
    );
  }

  ngOnInit(): void {
  }


  onSave() {
    if (this.shopDetailsForm.valid) {


      this.shopService.updateAddress(this.shopDetailsForm.value).subscribe((res) => {
        if (res.statusCode == 200) {
          this.toasterService.showMessage("Updated successfully.");
          this.dialogRef.close({
            updated: true,
          });
        }
        else {
          this.toasterService.showMessage(res.data);
        }
        this.isLoading = false;
      });

    }
  }

  onCancel(): void {    
    this.dialogRef.close({
      updated: false,
    });
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

}
