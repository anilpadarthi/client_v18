import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { SubCategoryService } from '../../../services/subCategory.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sub-category-list',
  templateUrl: './sub-category-list.component.html',
  styleUrl: './sub-category-list.component.scss'
})


export class SubCategoryListComponent implements OnInit {

  displayedColumns = ['ID', 'Name', 'DisplayOrder', 'Status', 'Actions'];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  subCategoryList: any[] = [];
  categories: any[] = [];
  searchText!: string | null;
  selectedCategoryId = null;
  categoryFilterCtrl: FormControl = new FormControl();
  filteredCategories: any[] = [];

  constructor
    (
      private router: Router,
      private toasterService: ToasterService,
      public dialog: MatDialog,
      private subCategoryService: SubCategoryService,
      private lookupService: LookupService
    ) { }

  ngOnInit(): void {
    this.getCategoryLookup();
    this.loadData();

    this.categoryFilterCtrl.valueChanges.subscribe(() => {
      this.filterCategories();
    });
  }

  private filterCategories() {
    const search = this.categoryFilterCtrl.value?.toLowerCase() || '';
    this.filteredCategories = this.categories.filter((item: any) =>
      `${item.name}`.toLowerCase().includes(search)
    );
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
      this.filteredCategories = res.data;
    });
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
        this.subCategoryService.deleteSubCategory(id).subscribe((res) => {
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
      categoryId: this.selectedCategoryId,
      searchText: this.searchText != null ? this.searchText.trim().toLowerCase() : null
    };

    this.subCategoryService.getByPaging(requestBody).subscribe((res) => {
      this.subCategoryList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }

  addoreditclick(id: any) {
    if (id != null) {
      this.router.navigate(['/sub-category/edit/' + id]);
    }
    else {
      this.router.navigate(['/sub-category/create']);
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
    this.selectedCategoryId = null;
    this.loadData();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.subCategoryList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }

  exportToExcel(): void {
    this.subCategoryService.exportToExcel();
  }

}
