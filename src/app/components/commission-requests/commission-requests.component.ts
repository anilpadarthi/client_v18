import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../helpers/paginator-constants';
import { ShopService } from '../../services/shop.service';
import { LookupService } from '../../services/lookup.service';
import { ToasterService } from '../../services/toaster.service';
import { WebstorgeService } from '../../services/web-storage.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { DenyRemarksDialogComponent } from '../common/deny-remarks-dialog/deny-remarks-dialog.component';
import { ApproveCommissionDialogComponent } from '../common/approve-commission-dialog/approve-commission-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-commission-requests',
  templateUrl: './commission-requests.component.html',
  styleUrl: './commission-requests.component.scss'
})

export class CommissionRequestsComponent {

  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  shopList: any[] = [];
  searchText!: string | null;
  selectedAgentId!: number | null;
  selectedStatus: string = '';
  agentLookup: any = [];
  isAdmin = false;
  isLoading = false;
  agentFilterCtrl: FormControl = new FormControl();
  filteredAgents: any[] = [];
  defaultStatusFilters: string[] = ['Hold', 'Review'];
  isAgent = false;

  displayedColumns: string[] = [
    'shopId',
    'shopName',
    'requestedBy',
    'requestDate',
    'fromDate',
    'toDate',
    'status',
    'action'
  ];


  constructor(
    private router: Router,
    private lookupService: LookupService,
    public dialog: MatDialog,
    private toasterService: ToasterService,
    private shopService: ShopService,
    private webstorgeService: WebstorgeService,
  ) { }

  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();

    if (userRole == 'Admin' || userRole == 'SuperAdmin' || userRole == 'OperationalManager') {
      this.isAdmin = true;
      this.selectedStatus = 'Reviewed';
      this.loadData();
    }
    else if (userRole == 'Agent') {
      this.isAgent = true;
      this.loadData();
    }
    else {
      this.selectedStatus = 'Hold';
      this.loadData();
    }
    this.getAgentLookup();
    this.agentFilterCtrl.valueChanges.subscribe(() => {
      this.filterAgents();
    });
  }


  private filterAgents() {
    const search = this.agentFilterCtrl.value?.toLowerCase() || '';
    this.filteredAgents = this.agentLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.agentLookup = res.data;
      this.filteredAgents = res.data;
    });
  }

  agentChange() {
    this.loadData();
  }


  loadData(): void {
    this.isLoading = true;
    const request = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      id: this.selectedAgentId,
      status: this.selectedStatus || ''
    };

    this.shopService.pendingCommissionChangeRequests(request).subscribe(
      (res) => {
        this.shopList = res.data.results;
        this.totalCount = res.data.totalRecords;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toasterService.showMessage('Failed to load commission requests');
      }
    );
  }

  handlePageEvent(event: PageEvent): void {
    this.totalCount = event.length;
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.pageNo = 0;
    this.searchText = null;
    this.selectedAgentId = null;
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin' || userRole == 'OperationalManager') {
      this.isAdmin = true;
      this.selectedStatus = 'Reviewed';
    }
    else {
      this.selectedStatus = 'Hold';
    }
    this.loadData();
  }

  onApprove(element: any): void {
    let commissionTypeHistory: any[] = [];
    this.shopService.getShopCommissionTypeHistory(element.shopId).subscribe(
      (res) => {


        const dialogRef = this.dialog.open(ApproveCommissionDialogComponent, {
          width: '520px',
          data: { shopName: element.shopName, shopId: element.shopId, commissionTypeHistory: res.data }
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.isLoading = true;
            const request = {
              commissionChangeRequestId: element.commissionChangeRequestId,
              shopId: element.shopId,
              status: 1,
              fromDate: result.fromDate,
              toDate: result.toDate,
              remarks: 'Approved with selected period'
            };

            this.shopService.updateCommissionChangeRequest(request).subscribe(
              (res) => {
                this.isLoading = false;
                this.toasterService.showMessage('Request approved successfully');
                this.loadData();
              },
              (error) => {
                this.isLoading = false;
                this.toasterService.showMessage('Failed to approve request');
              }
            );
          }
        });
      });
  }

  onReview(element: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Review Commission Request',
        message: `Are you sure you want to mark this request as reviewed for ${element.shopName}?`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.isLoading = true;
        const request = {
          commissionChangeRequestId: element.commissionChangeRequestId,
          shopId: element.shopId,
          status: 2,
          remarks: 'Marked as reviewed'
        };

        this.shopService.updateCommissionChangeRequest(request).subscribe(
          (res) => {
            this.isLoading = false;
            this.toasterService.showMessage('Request reviewed successfully');
            this.loadData();
          },
          (error) => {
            this.isLoading = false;
            this.toasterService.showMessage('Failed to review request');
          }
        );
      }
    });
  }

  onDeny(element: any): void {
    let commissionTypeHistory: any[] = [];
    this.shopService.getShopCommissionTypeHistory(element.shopId).subscribe(
      (res) => {

        const dialogRef = this.dialog.open(DenyRemarksDialogComponent, {
          width: '500px',
          data: { shopName: element.shopName, shopId: element.shopId, commissionTypeHistory: res.data }
        });

        dialogRef.afterClosed().subscribe((remarks) => {
          if (remarks) {
            this.isLoading = true;
            const request = {
              commissionChangeRequestId: element.commissionChangeRequestId,
              shopId: element.shopId,
              status: 4,
              remarks: remarks
            };

            this.shopService.updateCommissionChangeRequest(request).subscribe(
              (res) => {
                this.isLoading = false;
                this.toasterService.showMessage('Request denied successfully');
                this.loadData();
              },
              (error) => {
                this.isLoading = false;
                this.toasterService.showMessage('Failed to deny request');
              }
            );
          }
        });
      });
  }

  isReviewStatus(status: string): boolean {
    return status === 'Review' || status === 'Hold';
  }

}
