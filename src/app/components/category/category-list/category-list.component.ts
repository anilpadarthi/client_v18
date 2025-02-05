import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { CategoryService } from '../../../services/category.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})


export class CategoryListComponent implements OnInit {

  displayedColumns = ['ID', 'Name', 'DisplayOrder', 'Status', 'Actions'];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  categoryList: any[] = [];
  searchText!: string | null;


  constructor
    (
      private router: Router,
      private toasterService: ToasterService,
      public dialog: MatDialog,
      private categoryService: CategoryService
    ) { }

  ngOnInit(): void {
    this.loadData();
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
        this.categoryService.deleteCategory(id).subscribe((res) => {
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

    this.categoryService.getByPaging(requestBody).subscribe((res) => {
      this.categoryList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }

  addoreditclick(id: any) {
    if (id != null) {
      this.router.navigate(['/category/edit/' + id]);
    }
    else {
      this.router.navigate(['/category/create']);
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
    this.loadData();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.categoryList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }

  exportToExcel(): void {
    this.categoryService.exportToExcel();
  }

}
