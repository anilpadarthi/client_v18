import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../services/toaster.service';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent implements OnInit {

  displayedColumns = ["ID", "Name", "Code", "Category", "SubCategory", "DisplayOrder", "Actions"];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  areaList: any[] = [];
  searchText!: string | null;
  subCategories: any[] = [];
  categories: any[] = [];
  categoryId!: number | null;
  subCategoryId!: number | null;

  constructor
    (
      private router: Router,
      private toasterService: ToasterService,
      public dialog: MatDialog,
      private productService: ProductService,
      private lookupService: LookupService
    ) { }

  ngOnInit(): void {
    this.getCategoryLookup();
    this.loadData();
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  getSubCategoryLookup(categoryId: number) {
    this.lookupService.getSubCategories(categoryId).subscribe((res) => {
      this.subCategories = res.data;
    });
  }

  onCategoryChange(event: any) {
    this.pageNo = 0;
    if (event.value) {
      this.getSubCategoryLookup(event.value);
      this.loadData();
    } else {
      this.subCategories = [];
    }
  }

  onSubCategoryChange(event: any) {
    this.pageNo = 0;
    if (event.value) {
      this.loadData();
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
        this.productService.deleteProduct(id).subscribe((res) => {
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
    const requestBody = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      searchText: this.searchText != null ? this.searchText.trim().toLowerCase() : null
    };

    this.productService.getByPaging(requestBody).subscribe((res) => {
      this.areaList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }

  addoreditclick(id: any) {
    if (id != null) {
      this.router.navigate(['/product/edit/' + id]);
    }
    else {
      this.router.navigate(['/product/create']);
    }
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
    this.categoryId = null;
    this.subCategoryId = null;
    this.loadData();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.areaList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }
}
