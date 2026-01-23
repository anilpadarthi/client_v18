import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { NetworkService } from '../../../services/network.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-network-list',
  templateUrl: './network-list.component.html',
  styleUrl: './network-list.component.scss'
})
export class NetworkListComponent implements OnInit {

  displayedColumns: string[] = [
    'networkId',
    'name',
    'code',
    'skuCode',
    'status',
    'action',
  ];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  networkList: any[] = [];
  searchText!: string | null;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private toasterService: ToasterService,
    private networkService: NetworkService,

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
        this.networkService.deleteNetwork(id).subscribe((res) => {
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

    this.networkService.getByPaging(request).subscribe((res) => {
      this.networkList = res.data.results;
      this.totalCount = res.data.totalRecords;
      this.reloadData();
    });
  }

  addoreditclick(id: any) {
    if (id != null) {
      this.router.navigate(['/network/edit/' + id]);
    }
    else {
      this.router.navigate(['/network/create']);
    }
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
    this.loadData();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  reloadData(): void {
    if (this.pageNo > 0 && this.networkList?.length == 0) {
      this.pageNo = this.pageNo - 1;
      this.loadData();
    }
  }



}
