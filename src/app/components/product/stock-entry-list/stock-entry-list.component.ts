import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { PurchaseService } from '../../../services/purchase.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToasterService } from '../../../services/toaster.service';
import { LookupService } from '../../../services/lookup.service';

@Component({
  selector: 'app-stock-entry-list',
  templateUrl: './stock-entry-list.component.html',
  styleUrl: './stock-entry-list.component.scss'
})


export class StockEntryListComponent implements OnInit {

  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  invoiceList: any[] = [];
  suppliers: any[] = [];
  selectedSupplierId = null;
  searchText!: string | null;
  displayedColumns: string[] = [
    'InvoiceNumber',
    'SupplierId',
    'TotalAmount',
    'InvoiceDate',
    'Action'
  ];


  constructor(
    private router: Router,
    private purchaseService: PurchaseService,
    private lookupService: LookupService,
    public dialog: MatDialog,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.lookupService.getSuppliers().subscribe((res) => {
      this.suppliers = res.data;
    });
    this.loadData();
  }



  addoreditclick(id: any) {
    if (id > 0) {
      this.router.navigate(['/invoice/' + id]);
    }
    else {
      this.router.navigate(['/invoice/create']);
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
        this.purchaseService.delete(id).subscribe((res) => {
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
      id: this.selectedSupplierId,
      searchText: this.searchText != null ? this.searchText.trim().toLowerCase() : null
    };

    this.purchaseService.getByPaging(request).subscribe((res) => {
      this.invoiceList = res.data.results;
      this.totalCount = res.data.totalRecords;
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
    this.loadData();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.invoiceList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }

}