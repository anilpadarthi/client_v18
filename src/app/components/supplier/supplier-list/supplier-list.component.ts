import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { SupplierService } from '../../../services/supplier.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ToasterService } from '../../../services/toaster.service';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { SupplierTransactionEditorComponent } from '../supplier-transaction-editor/supplier-transaction-editor.component';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})

export class SupplierListComponent implements OnInit {

  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  supplierList: any[] = [];
  searchText!: string | null;
  displayedColumns: string[] = [
    'SupplierId',
    'SupplierName',
    'OutStandingBalance',
    'Action'
  ];


  constructor(
    private router: Router,
    private supplierService: SupplierService,
    public dialog: MatDialog,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  addoreditclick(id: any) {
    if (id > 0) {
      this.router.navigate(['/supplier/edit/' + id]);
    }
    else {
      this.router.navigate(['/supplier/create']);
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
        this.supplierService.deleteSupplier(id).subscribe((res) => {
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
      searchText: this.searchText != null ? this.searchText.trim().toLowerCase() : null
    };

    this.supplierService.getByPaging(request).subscribe((res) => {
      this.supplierList = res.data.results;
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
    if (this.pageNo > 0 && this.supplierList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }

  addTransaction(): void {
    this.dialog.open(SupplierTransactionEditorComponent);
  }

  loadSupplierTransactions(supplier: any): void {
    this.supplierService.supplierTransactions(supplier.supplierId).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: "Supplier Transactions - " + supplier.supplierName
      }
      this.dialog.open(PopupTableComponent, {
        data
      });
    });
  }

}