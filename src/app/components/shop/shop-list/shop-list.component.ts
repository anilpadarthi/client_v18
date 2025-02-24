import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { ShopService } from '../../../services/shop.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.scss'
})

export class ShopListComponent implements OnInit {

  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  shopList: any[] = [];
  searchText!: string | null;
  selectedAreaId!: 0;
  areaLookup: any = [];
  isDisplay = false;
  displayedColumns: string[] = [
    'shopId',
    'shopName',
    'postCode',
    'address',
    'areaName',
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
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplay = true;
      this.loadData();
    }
    this.getAreaLookup();
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
    });
  }

  areaChange() {
    this.loadData();
  }


  addoreditclick(id: any) {
    if (id != null) {
      this.router.navigate(['/shop/edit/' + id]);
    }
    else {
      this.router.navigate(['/shop/create']);
    }
  }

  deleteclick(id: any) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm?',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.shopService.deleteShop(id).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Deleted successfully");
            this.loadData();
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    });
  }

  loadData(): void {

    const request = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      areaId: this.selectedAreaId,
      searchText: this.searchText != null ? this.searchText.trim().toLowerCase() : null
    };

    this.shopService.getByPaging(request).subscribe((res) => {
      this.shopList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.totalCount = event.length;
    this.pageNo = (this.pageSize === event.pageSize) ? event.pageIndex : 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.pageNo = 0;
    this.searchText = null;
    this.selectedAreaId = 0;
    this.loadData();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.shopList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }

  exportToExcel(): void {
    this.shopService.exportToExcel();
  }

}
