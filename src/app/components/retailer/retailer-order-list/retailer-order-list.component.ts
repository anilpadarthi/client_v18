
import { Component, OnInit, Inject } from '@angular/core';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { OrderService } from '../../../services/order.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { Router } from '@angular/router';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { OrderDetailsComponent } from '../../order/order-details/order-details.component';
import { FormControl } from '@angular/forms';
import { cleanDate } from '../../../helpers/utils';

@Component({
  selector: 'app-retailer-order-list',
  templateUrl: './retailer-order-list.component.html',
  styleUrl: './retailer-order-list.component.scss'
})

export class RetailerOrderListComponent implements OnInit {

  displayedColumns = [
    "actions",
    "orderId",
    "date",
    "user",
    "shop",
    "expected",
    "collected",
    "status",
    "paymentMethod",
    "courier",
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
  selectedShopId: any = null;
  selectedShippingMethodId = null;
  orderNumberSearch: any = null;
  trackNumberSearch: any = null;
  shopNameSearch: any = null;
  selectedFromDate: any;
  selectedToDate: any;
  isVat = false;
  isShowOutstandingMetrics = false;
  userRole = '';
  isAdmin = false;
  isWareHouseKeeper = false;
  areaFilterCtrl: FormControl = new FormControl();
  shopFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];
  filteredShops: any[] = [];
  userFilterCtrl: FormControl = new FormControl();
  managerFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  filteredManagers: any[] = [];

  totalOutstanding = 0.00;
  totalPPAAmount = 0.00;
  totalPPMAmount = 0.00;
  showAdvancedFilters: boolean = false;
  loggedInUserId: number = 0;

  orderList = [];

  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService,
    private toasterService: ToasterService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
    this.loggedInUserId = this.webstorgeService.getUserInfo().userId;
    this.shopNameSearch = this.loggedInUserId.toString();
    this.loadData();
  }

  loadData(): void {
    const requestBody = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      shopName: this.shopNameSearch?.trim() || null,
      orderId: this.orderNumberSearch?.trim() || null,
      trackingNumber: this.trackNumberSearch?.trim() || null,
    };

    this.orderService.getPagedOrderList(requestBody).subscribe((res) => {
      this.orderList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }


  onFilter(): void {
    this.pageNo = 0;
    this.loadData();
    //this.loadOutstandingMetrics();
  }

  onClear(): void {
    this.pageNo = 0;
    this.selectedAgentId = null;
    this.selectedAreaId = null;
    this.selectedManagerId = null;
    this.selectedShopId = null;
    this.shopNameSearch = null;
    this.selectedStatusId = null;
    this.selectedPaymentMethodId = null;
    this.selectedShippingMethodId = null;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.orderNumberSearch = null;
    this.trackNumberSearch = null;
    this.isVat = false;
    this.isShowOutstandingMetrics = false;
    this.shopNameSearch = this.loggedInUserId.toString();
    this.loadData();
  }

  handlePageEvent(event: PageEvent): void {
    this.totalCount = event.length;
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.orderList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
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
      const dialogRef = this.dialog.open(OrderDetailsComponent, {
        data
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadData();  // Call loadData() after the dialog closes
        }
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

  downloadNonVAT(orderId: number): void {
    this.orderService.downloadNonVATInvoice(orderId);
  }

  createNewOrder(): void {
    const fullPath = this.router.serializeUrl(
      this.router.createUrlTree([`accessories/create-order/${this.loggedInUserId}/COD`])
    );
    window.open(fullPath, '_blank');
  }

}
