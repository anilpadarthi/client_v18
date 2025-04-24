import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { environment } from '../../../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';

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
  IsDisplayAvailableCheques = false;
  IsDisabled = false;
  availableCommissionChequeNumbers: any[] = [];
  balanceAmount = 0.00;
  selectedOption: any = '';

  constructor
    (
      @Inject(MAT_DIALOG_DATA) public data: any,
      private orderService: OrderService,
      private toasterService: ToasterService,
      private lookupService: LookupService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<OrderPaymentEditorComponent>,
    ) {
    this.orderId = data.orderId;
    this.shopId = data.shopId;
    this.balanceAmount = data.balanceAmount;
    this.paymentForm = this.fb.group(
      {
        referenceNumber: ['', [Validators.required, Validators.minLength(2)]],
        amount: ['', [Validators.required]],
        paymentMode: ['', [Validators.required]],
        comments: [''],
        image: null as File | null,
      },
    );
  }

  ngOnInit(): void {
    this.referenceImagePreview = '/assets/images/profile/user-1.jpg';
    this.loadAvailableCheques();
    this.getOrderPaymentDetails();
  }

  onRadioChange(event: MatRadioChange) {
    // You can also do something based on the value
    if (event.value === 'FA') {
      this.paymentForm.get('amount')?.setValue(this.balanceAmount);
    }
    else{
      this.paymentForm.get('amount')?.setValue('');
    }
  }

  loadAvailableCheques() {
    this.lookupService.getAvailableShopCommissionCheques(this.shopId).subscribe((res) => {
      this.availableCommissionChequeNumbers = res.data;
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
        if (res.statusCode == 201) {
          this.toasterService.showMessage("Saved successfully.");
          this.dialogRef.close({ event: 'Cancel' });
        }
        else {
          this.toasterService.showMessage(res.data);
        }
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
      this.paymentForm.patchValue({ referenceNumber: '' });
      this.paymentForm.patchValue({ amount: '' });
      this.IsDisabled = false;
    }
  }

  onPaymentModeChange(event: any): void {
    this.paymentForm.patchValue({ referenceNumber: '' });
    this.paymentForm.patchValue({ amount: '' });

    if (event.value == 'CommissionCheque') {
      this.IsDisplayAvailableCheques = true;
      this.paymentForm.get('referenceNumber')?.disable();
      this.paymentForm.get('amount')?.disable();
    }
    else {
      this.IsDisplayAvailableCheques = false;
      this.paymentForm.get('referenceNumber')?.enable();
      this.paymentForm.get('amount')?.enable();
    }
  }

}
