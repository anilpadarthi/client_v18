import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WebstorgeService } from '../../../services/web-storage.service';
import { ToasterService } from '../../../services/toaster.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})

export class OrderDetailsComponent implements OnInit {

  @Output() notifyParent = new EventEmitter<string>();
  orderItems: any[] = [];
  header = '';
  orderId = null;
  selectedStatusId = null;
  selectedPaymentMethodId = null;
  selectedShippingMethodId = null;
  statusLookup: any[] = [];
  paymentMethodLookup: any[] = [];
  shippingMethodLookup: any[] = [];
  trackingNumber = null;
  userRole = '';
  isAdmin = false;


  vatAmount = 0.00;
  subTotal = 0.00;
  deliveryCharges = 0.00;
  discountAmount = 0.00;
  grandTotal = 0.00;
  discountPercentage = 0.00;
  vatPercentage = 0.00;
  grandTotalWithVAT = 0.00;
  grandTotalWithOutVAT = 0.00;

  displayedColumns: string[] = [
    'productName',
    'productCode',
    'sellingPrice',
    'quantity',
    'amount',
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private toasterService: ToasterService,
    private webstorgeService: WebstorgeService,
    public dialogRef: MatDialogRef<OrderDetailsComponent>) {

    if (data.orderDetails) {

      this.userRole = this.webstorgeService.getUserRole();
      let loggedInUserId = this.webstorgeService.getUserInfo().userId;
      if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
        this.isAdmin = true;
      }

      this.orderItems = data.orderDetails.items;
      this.header = data.headerName;
      this.orderId = data.orderDetails.orderId;
      this.statusLookup = data.statusLookup.filter((f:any) => f.name != "PPA" && f.name != "PPM" && f.name != "PPS");
      this.paymentMethodLookup = data.paymentMethodLookup;//.filter((f:any) => f.name != "Bonus" && f.name != "Monthly Commission")
      this.shippingMethodLookup = data.shippingMethodLookup;
      this.selectedStatusId = data.orderDetails.orderStatusTypeId;
      this.selectedPaymentMethodId = data.orderDetails.orderPaymentTypeId;
      this.selectedShippingMethodId = data.orderDetails.orderDeliveryTypeId;
      this.trackingNumber = data.orderDetails.trackingNumber;
      this.deliveryCharges = data.orderDetails.deliveryCharges;
      this.vatPercentage = data.orderDetails.vatPercentage;
      this.discountPercentage = data.orderDetails.discountPercentage;
      this.updateCalculations();
    }

  }

  ngOnInit(): void {



  }
  updateOrder(): void {
    const requestBody = {
      orderId: this.orderId,
      orderStatusId: this.selectedStatusId,
      paymentMethodId: this.selectedPaymentMethodId,
      shippingModeId: this.selectedShippingMethodId,
      trackingNumber: this.trackingNumber
    };

    this.orderService.updateOrderDetails(requestBody).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Updated Successfully.");
        this.dialogRef.close(true);
      }
      else {
        this.toasterService.showMessage(res.data);
      }
    });
  }

  updateCalculations() {
    this.subTotal = 0;
    this.orderItems?.forEach((product: any) => {
      this.subTotal += product.qty * product.salePrice;
    });
    let netTotal = this.subTotal;
    this.vatAmount = (netTotal * this.vatPercentage) / 100;

    if (this.discountPercentage > 0) {
      this.discountAmount = (this.subTotal * this.discountPercentage) / 100;
    }
    this.grandTotalWithVAT = (netTotal + this.vatAmount + this.deliveryCharges) - this.discountAmount;
    this.grandTotalWithOutVAT = (netTotal + this.deliveryCharges) - this.discountAmount;
    this.grandTotal = (netTotal + this.vatAmount + this.deliveryCharges) - this.discountAmount;
  }

  close(): void {
    this.dialogRef.close(false);
  }


}
