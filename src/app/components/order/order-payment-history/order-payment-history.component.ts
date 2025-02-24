import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebstorgeService } from '../../../services/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { OrderService } from '../../../services/order.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-order-payment-history',
  templateUrl: './order-payment-history.component.html',
  styleUrl: './order-payment-history.component.scss'
})
export class OrderPaymentHistoryComponent implements OnInit {

  dataSource: any = [];
  displayedColumns: string[] = [
    'amount',
    'paymentDate',
    'referenceNumber',
    'collectedStatus',
    'collectedBy',
    'comments',
    'action',
  ];
  orderId = 0;
  isDisplay = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public webstorgeService: WebstorgeService,
    public orderService: OrderService,
    public toasterService: ToasterService,
    public dialog: MatDialog,
  ) {
    this.orderId = data.orderId;
  }

  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplay = true;
    }
    this.loadData();
  }

  loadData(): void {
    this.orderService.getOrderPaymentHistory(this.orderId).subscribe((res) => {
      this.dataSource = res.data;
    });
  }

  collectedByAdmin(orderPaymentId: number): void {
    this.orderService.updatePayment(orderPaymentId).subscribe((res) => {
      this.dataSource = res.data;
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Updated successfully.");
        this.loadData();
      }
      else {
        this.toasterService.showMessage("Something went wrong.");
      }
    });

  }

  deleteclick(orderPaymentId: number) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm?',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.orderService.deletePayment(orderPaymentId).subscribe((res) => {
          this.dataSource = res.data;
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Deleted successfully.");
            this.loadData();
          }
          else {
            this.toasterService.showMessage("Something went wrong.");
          }
        });
      }
    });
  }

}
