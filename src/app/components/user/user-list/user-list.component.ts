import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToasterService } from '../../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent {

  displayedColumns: string[] = [
    'userId',
    'name',
    'email',
    'role',
    'status',
    'action',
  ];

  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  userList: any[] = [];
  searchText!: string | null;


  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const request = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      searchText: this.searchText != null ? this.searchText.trim().toLowerCase() : null
    };

    this.userService.getByPaging(request).subscribe((res) => {
      this.userList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }


  addoreditclick(id: any) {
    if (id > 0) {
      this.router.navigate(['/user/edit/' + id]);
    }
    else {
      this.router.navigate(['/user/create']);
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
        this.userService.deleteUser(id).subscribe((res) => {
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
    if (this.pageNo > 0 && this.userList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }



}