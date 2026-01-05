import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { OnFieldService } from '../../../services/on-field.service';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { WebstorgeService } from '../../../services/web-storage.service';

@Component({
  selector: 'app-order-payment-editor',
  templateUrl: './order-payment-editor.component.html',
  styleUrl: './order-payment-editor.component.scss'
})

export class OrderPaymentEditorComponent {

  paymentForm: FormGroup;
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
      private orderService: OrderService,
      private toasterService: ToasterService,
      private lookupService: LookupService,
      private onFieldService: OnFieldService,
      private webstorgeService: WebstorgeService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<OrderPaymentEditorComponent>,
    ) {
    this.orderId = data.orderId;
    this.shopId = data.shopId;
    this.balanceAmount = data.balanceAmount;
    this.paymentForm = this.fb.group(
      {
        referenceNumber: [null],
        amount: [null, [Validators.required]],
        paymentMode: [null, [Validators.required]],
        chequeNumber: [null],
        comments: [''],
        amountType: [''],
        image: null as File | null,
      },
    );
  }

  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }
    this.referenceImagePreview = '/assets/images/profile/user-1.jpg';
    this.loadAvailableCheques();
    this.loadShopWallets();
    this.getOrderPaymentDetails();
  }

  onRadioChange(event: MatRadioChange) {
    // You can also do something based on the value
    if (event.value === 'FA') {
      this.paymentForm.get('amount')?.setValue(this.balanceAmount);
    }
    else {
      this.paymentForm.get('amount')?.setValue('');
    }
  }

  loadAvailableCheques() {
    this.lookupService.getAvailableShopCommissionCheques(this.shopId).subscribe((res) => {
      this.availableCommissionChequeNumbers = res.data;
    });
  }

  loadShopWallets() {
    this.onFieldService.onFieildCommissionWalletAmounts(this.shopId).subscribe((res) => {
      if (res.data != null) {
        this.commissionWalletAmount = res.data?.outstandingCommissionAmount;
        this.bonusWalletAmount = res.data?.outstandingBonusAmount;
        console.log(this.bonusWalletAmount);
      }
      else {
        this.commissionWalletAmount = 0;
        this.bonusWalletAmount = 0;
        this.instantBonusWalletAmount = 0;
      }
    });
  }

  getOrderPaymentDetails() {
    if (this.paymentId != null && this.paymentId > 0) {
      this.orderService.getPayment(this.paymentId).subscribe((res) => {
        this.paymentForm.patchValue(res.data);
        if (res.data?.image) {
          this.referenceImagePreview = environment.backend.host + '/' + res.data?.image;
        }
      });
    }
  }

  onSave() {
    if (this.paymentForm.valid) {
      if (this.paymentType == "Commission" && this.paymentForm.getRawValue().amount > this.commissionWalletAmount) {
        this.toasterService.showMessage("You cann not redem using commission wallet, It exceeds the amount");
        return;
      }
      else if (this.paymentType == "Bonus" && this.paymentForm.getRawValue().amount > this.bonusWalletAmount) {
        this.toasterService.showMessage("You cann not redem using bonus wallet, It exceeds the amount");
        return;
      }
      else if (this.paymentType == "InstantBonus" && this.paymentForm.getRawValue().amount > this.instantBonusWalletAmount) {
        this.toasterService.showMessage("You cann not redem using instant bonus wallet, It exceeds the amount");
        return;
      }
      this.isLoading = true;
      const formBody = new FormData();
      formBody.append('orderId', this.orderId != null ? this.orderId : 0);
      formBody.append('shopId', this.shopId != null ? this.shopId : 0);
      formBody.append('paymentId', this.paymentId != null ? this.paymentId : 0);
      formBody.append('paymentMode', this.paymentForm.value.paymentMode);
      formBody.append('referenceNumber', this.paymentForm.getRawValue().referenceNumber);
      formBody.append('amount', this.paymentForm.getRawValue().amount);
      formBody.append('comments', this.paymentForm.value.comments);

      if (this.referenceImagePreview != null) {
        formBody.append('referenceImage', this.paymentForm.value.image);
      }

      this.orderService.createPayment(formBody).subscribe((res) => {
        if (res.statusCode == 200) {
          this.toasterService.showMessage("Saved successfully.");          
        }
        else {
          this.toasterService.showMessage(res.data);
        }
        this.isLoading = false;
        this.dialogRef.close({ event: 'Cancel' });
      });

    }
  }

  onCancel(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.paymentForm.patchValue({ image: file });
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.referenceImagePreview = event?.target?.result;
    }
  }

  onChequeNumberChange(event: any): void {
    let item = this.availableCommissionChequeNumbers.find(f => f.id == event.value);
    if (item != null) {
      this.paymentForm.patchValue({ referenceNumber: item.id });
      this.paymentForm.patchValue({ amount: item.name });
      this.IsDisabled = true;
    }
    else {
      this.paymentForm.patchValue({ referenceNumber: null });
      this.paymentForm.patchValue({ amount: null });
      this.IsDisabled = false;
    }
  }

  onPaymentModeChange(event: any): void {
    this.paymentForm.patchValue({ referenceNumber: null });
    this.paymentForm.patchValue({ amount: null });
    this.paymentForm.patchValue({ chequeNumber: null });
    this.paymentType = event.value;

    const ref = this.paymentForm.get('referenceNumber');
    const amt = this.paymentForm.get('amount');
    const cheque = this.paymentForm.get('chequeNumber');
    const amountType = this.paymentForm.get('amountType');

    if (event.value === 'CommissionCheque') {

      ref?.disable();
      amt?.disable();

      // Remove validators from referenceNumber and amount
      ref?.clearValidators();
      amt?.clearValidators();

      // Add validator for chequeNumber
      cheque?.setValidators([Validators.required]);

    } else {

      ref?.enable();
      amt?.enable();

      // Reset amount type if needed
      amountType?.reset();

      // Restore validators
      amt?.setValidators([Validators.required]);

      cheque?.clearValidators();
    }

    // 🔥 VERY IMPORTANT (refresh validation)
    ref?.updateValueAndValidity();
    amt?.updateValueAndValidity();
    cheque?.updateValueAndValidity();

  }

}
