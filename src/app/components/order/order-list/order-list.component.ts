import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { OrderService } from '../../../services/order.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { Router } from '@angular/router';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})

export class OrderListComponent implements OnInit {

  displayedColumns = [
    "orderId",
    "date",
    "user",
    "area",
    "shop",
    "amount",
    "status",
    "paymenthMethod",
    "courier",
    "actions",
  ];

  pageEvent: PageEvent | undefined;
  tableDataSource: any;
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.LEAP_STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount!: number;
  agentLookup: any[] = [];
  managerLookup: any[] = [];
  statusLookup: any[] = [];
  paymentMethodLookup: any[] = [];
  areaLookup: any[] = [];
  shopLookup: any[] = [];
  shippingMethodLookup: any[] = [];
  selectedStatusId = null;
  selectedPaymentMethodId = null;
  selectedAgentId = null;
  selectedManagerId = null;
  selectedAreaId = null;
  selectedShopId = null;
  selectedShippingMethodId = null;
  orderNumberSearch = null;
  trackNumberSearch = null;
  selectedFromDate = null;
  selectedToDate = null;
  isVat = false;

  orderList = [];

  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private lookupService: LookupService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadData();
    this.loadDropDowns();
  }

  loadData(): void {

    const requestBody = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      areaId: this.selectedAreaId,
      shopId: this.selectedShopId,
      orderStatusId: this.selectedStatusId,
      paymentMethodId: this.selectedPaymentMethodId,
      shippingModeId: this.selectedShippingMethodId,
      agentId: this.selectedAgentId,
      managerId: this.selectedManagerId,
      fromDate: this.selectedFromDate,
      toDate: this.selectedToDate,
      orderId: this.orderNumberSearch,
      trackingNumber: this.trackNumberSearch,
      isVat: this.isVat ? 1 : 0
    };

    this.orderService.getPagedOrderList(requestBody).subscribe((res) => {
      this.orderList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }

  loadDropDowns(): void {

    this.lookupService.getOrderStatusTypes().subscribe((res) => {
      this.statusLookup = res.data;
    });

    this.lookupService.getOrderPaymentTypes().subscribe((res) => {
      this.paymentMethodLookup = res.data;
    });

    this.lookupService.getOrderDeliveryTypes().subscribe((res) => {
      this.shippingMethodLookup = res.data;
    });

    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
    });

    this.lookupService.getAgents().subscribe((res) => {
      this.agentLookup = res.data;
    });

    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
    });
  }

  areaChange(): void {
    if (this.selectedAreaId) {
      this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
        this.shopLookup = res.data;
      });
    }
    else {
      this.shopLookup = [];
    }
  }


  onFilter(): void {
    this.pageNo = 0;
    this.loadData();
  }

  onClear(): void {
    this.pageNo = 0;
    this.selectedAgentId = null;
    this.selectedAreaId = null;
    this.selectedManagerId = null;
    this.selectedShopId = null;
    this.selectedStatusId = null;
    this.selectedPaymentMethodId = null;
    this.selectedShippingMethodId = null;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.orderNumberSearch = null;
    this.trackNumberSearch = null;
    this.isVat = false;
    this.loadData();
  }

  handlePageEvent(event: PageEvent): void {
    this.totalCount = event.length;
    this.pageNo = (this.pageSize === event.pageSize) ? event.pageIndex : 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.orderList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }

  editOrder(orderId: number): void {
      const fullPath = this.router.serializeUrl(
        this.router.createUrlTree([`aceessories/edit-order/${ orderId }`])
      );
      window.open(fullPath, '_blank');

  }

  viewOrder(orderId: number): void {
    this.orderService.getById(orderId).subscribe((res) => {
      var data = {
        orderDetails: res.data,
        headerName: 'Order Details',
        statusLookup: this.statusLookup,
        paymentMethodLookup: this.paymentMethodLookup,
        shippingMethodLookup: this.shippingMethodLookup
      }
      this.dialog.open(OrderDetailsComponent, {
        data
      });
    });
  }

  orderHistory(orderId: number): void {

    this.orderService.getOrderHistory(orderId).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: 'Order History'
      }
      this.dialog.open(PopupTableComponent, {
        data
      });
    });

  }

  paymentHistory(orderId: number): void {

    this.orderService.getOrderPaymentHistory(orderId).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: 'Order Payment History'
      }
      this.dialog.open(PopupTableComponent, {
        data
      });
    });

  }

  download(orderId: number): void {

  }

  sendEmail(orderId: number): void {

  }

  makePayment(orderId: number): void {

  }



}
