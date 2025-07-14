import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { OrderService } from '../../../services/order.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { Router } from '@angular/router';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { OrderPaymentEditorComponent } from '../order-payment-editor/order-payment-editor.component';
import { OrderPaymentHistoryComponent } from '../order-payment-history/order-payment-history.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})

export class OrderListComponent implements OnInit {

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
    "courier"
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
  selectedFromDate = null;
  selectedToDate = null;
  isVat = false;
  isShowOutstandingMetrics = false;
  userRole = '';
  isAdmin = false;
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
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;

    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin' || this.userRole == 'CallCenter') {
      this.isAdmin = true;
      //this.loadOutstandingMetrics();
    }
    else if (this.userRole == 'Manager') {
      this.selectedManagerId = loggedInUserId;
    }
    else {
      this.selectedAgentId = loggedInUserId;
    }
    this.loadData();
    this.loadDropDowns();

    this.areaFilterCtrl.valueChanges.subscribe(() => {
      this.filterAreas();
    });
    this.shopFilterCtrl.valueChanges.subscribe(() => {
      this.filterShops();
    });

    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
    this.managerFilterCtrl.valueChanges.subscribe(() => {
      this.filterManagers();
    });
  }

  loadData(): void {

    const requestBody = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      areaId: this.selectedAreaId,
      shopId: this.selectedShopId?.trim() || null,
      orderStatusId: this.selectedStatusId,
      paymentMethodId: this.selectedPaymentMethodId,
      shippingModeId: this.selectedShippingMethodId,
      agentId: this.selectedAgentId,
      managerId: this.selectedManagerId,
      fromDate: this.selectedFromDate,
      toDate: this.selectedToDate,
      orderId: this.orderNumberSearch?.trim() || null,
      trackingNumber: this.trackNumberSearch?.trim() || null,
      isVat: this.isVat ? 1 : 0,
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
      this.filteredAreas = res.data;
    });

    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin' || this.userRole == 'Manager') {
      this.lookupService.getAgents().subscribe((res) => {
        this.agentLookup = res.data;
        this.filteredUsers = res.data;
      });
    }
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
      this.lookupService.getManagers().subscribe((res) => {
        this.managerLookup = res.data;
        this.filteredManagers = res.data;
      });
    }
  }

  loadOutstandingMetrics(): void {
    if (this.selectedAgentId != null && this.isAdmin) {
      let requestBody = {
        filterType: 'Agent',
        filterId: this.selectedAgentId
      };
      this.orderService.loadOutstandingMetrics(requestBody).subscribe((res) => {
        this.totalOutstanding = res.data?.totalOutstanding;
        this.totalPPAAmount = res.data?.totalPPAAmount;
        this.totalPPMAmount = res.data?.totalPPMAmount;
        this.isShowOutstandingMetrics = true;
      });
    }
  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.agentLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterManagers() {
    const search = this.managerFilterCtrl.value?.toLowerCase() || '';
    this.filteredManagers = this.managerLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterAreas() {
    const search = this.areaFilterCtrl.value?.toLowerCase() || '';
    this.filteredAreas = this.areaLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterShops() {
    const search = this.shopFilterCtrl.value?.toLowerCase() || '';
    this.filteredShops = this.shopLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }


  areaChange(): void {
    if (this.selectedAreaId) {
      this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
        this.shopLookup = res.data;
        this.filteredShops = res.data;
      });
    }
    else {
      this.shopLookup = [];
      this.filteredShops = [];
    }
  }

  managerChange(): void {
    if (this.selectedManagerId) {
      this.lookupService.getAgentsByManager(this.selectedManagerId).subscribe((res) => {
        this.agentLookup = res.data;
        this.filteredUsers = res.data;
      });
    }
    else {
      this.lookupService.getAgents().subscribe((res) => {
        this.agentLookup = res.data;
        this.filteredUsers = res.data;
      });
    }
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
    this.selectedStatusId = null;
    this.selectedPaymentMethodId = null;
    this.selectedShippingMethodId = null;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.orderNumberSearch = null;
    this.trackNumberSearch = null;
    this.isVat = false;
    this.isShowOutstandingMetrics = false;
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
      this.router.createUrlTree([`accessories/edit-order/${orderId}`])
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

  paymentHistory(orderId: number): void {

    this.orderService.getOrderPaymentHistory(orderId).subscribe((res) => {
      var data = {
        orderId: orderId
      }
      this.dialog.open(OrderPaymentHistoryComponent, {
        data
      });
    });

  }

  downloadVAT(orderId: number): void {
    this.orderService.downloadVATInvoice(orderId);
  }

  downloadNonVAT(orderId: number): void {
    this.orderService.downloadNonVATInvoice(orderId);
  }

  sendEmail(orderId: number): void {
    this.orderService.sendVATInvoice(orderId).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage('Email sent successfully.');
      }
      else {
        this.toasterService.showMessage(res.message);
        //this.toasterService.showMessage('Some thing went wrong, while sending an Email.');
      }
    });
  }

  addPayment(item: any): void {

    this.orderService.getOrderPaymentHistory(item.orderId).subscribe((res) => {
      var data = {
        orderId: item.orderId,
        shopId: item.shopId,
        balanceAmount: (item.isVAT == 1 ? item.totalWithVATAmount : item.totalWithOutVATAmount) - (res.data != null && res.data.length > 0 ? res.data.reduce((sum: any, s: any) => sum + s.amount, 0) : 0)
      }
      this.dialog.open(OrderPaymentEditorComponent, {
        data
      });
    });
  }

  cancelOrder(orderDetails: any): void {
    const requestBody = {
      orderId: orderDetails.orderId,
      orderStatusId: 3, // cancelled order
      paymentMethodId: orderDetails.paymentMethodId,
      shippingModeId: orderDetails.shippingModeId,
      trackingNumber: orderDetails.trackingNumber
    };

    this.orderService.updateOrderDetails(requestBody).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Cancelled Successfully.");
        this.loadData();
      }
      else {
        this.toasterService.showMessage(res.data);
      }
    });
  }

  hideOrder(orderId: number, isHide: any): void {
    this.orderService.hideOrder(orderId, !isHide).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Successfully hidden.");
      }
      else {
        this.toasterService.showMessage(res.data);
      }
    });
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onExport(): void {

    const requestBody = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      areaId: this.selectedAreaId,
      shopId: this.selectedShopId?.trim() || null,
      orderStatusId: this.selectedStatusId,
      paymentMethodId: this.selectedPaymentMethodId,
      shippingModeId: this.selectedShippingMethodId,
      agentId: this.selectedAgentId,
      managerId: this.selectedManagerId,
      fromDate: this.selectedFromDate,
      toDate: this.selectedToDate,
      orderId: this.orderNumberSearch?.trim() || null,
      trackingNumber: this.trackNumberSearch?.trim() || null,
      isVat: this.isVat ? 1 : 0,
    };

    this.orderService.downloadOrders(requestBody);
  }

}
