import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../services/order.service';
import { OutstandingBalanceDialogComponent } from '../outstanding-balance-dialog/outstanding-balance-dialog.component';
import { WebstorgeService } from '../../../services/web-storage.service';

@Component({
  selector: 'app-un-paid-orders',
  templateUrl: './un-paid-orders.component.html',
  styleUrl: './un-paid-orders.component.scss'
})
export class UnPaidOrdersComponent implements OnInit {

  unPaidOrderList: any[] = [];
  outstandingBalance = 0;

  displayedColumns = [
    'userName',
    'balanceAmount',
  ];
  userRole: string | null = null;
  
  constructor(private orderService: OrderService, private dialog: MatDialog, private webstorgeService: WebstorgeService) {

    this.userRole = this.webstorgeService.getUserRole();
  }

  ngOnInit(): void {
    this.orderService.getUnPaidOrders().subscribe((res) => {
      this.unPaidOrderList = res.data;

      this.outstandingBalance = this.unPaidOrderList.reduce(
        (sum, order) => sum + (order.balanceAmount || 0),
        0
      );     

      if (this.outstandingBalance > 0) {
        this.openOutstandingBalanceDialog();
      }
    });
  }

  openOutstandingBalanceDialog(): void {
    this.dialog.open(OutstandingBalanceDialogComponent, {
      width: '420px',
      data: {
        title: 'Outstanding Balance Alert',
        message: 'You currently have an outstanding balance that needs attention.',
        amount: this.outstandingBalance,
      },
      disableClose: true,
    });
  }
}
