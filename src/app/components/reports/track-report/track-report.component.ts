import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../../../services/tracking.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { cleanDate } from '../../../helpers/utils';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-track-report',
  templateUrl: './track-report.component.html',
  styleUrl: './track-report.component.scss'
})


export class TrackReportComponent implements OnInit {

  fromDate: any = null;
  filterType = 'All';
  mode = '';
  selectedUserId = null;
  selectedMonth: string | null = null;
  totalCount = 0;
  isOpenModel = false;
  userLookup: any = [];
  dataSource: any = [];
  detailData: any = [];
  userFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  displayedColumns1: string[] = [];
  displayedColumns: string[] = [
    'UserId',
    'UserName',
    'Date',
    'AreasVisited',
    'ShopsVisited',
    'ShopsSimsGiven',
    'TotalTime',
    'Login',
    'FirstShop',
    'LogOut',
    'RouteMap'
  ];

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private trackingService: TrackingService,
    private lookupService: LookupService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.getUserLookup();
    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  getUserLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  loadData(): void {
    const requestBody = {
      fromDate: cleanDate(this.datePipe.transform(this.fromDate, 'yyyy-MM-dd')),
      filterType: this.filterType,
      filterId: this.selectedUserId
    };

    this.trackingService.getTrackReport(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.dataSource = res.data;
      }
      else {
        this.dataSource = null;
      }
    });
  }

  onFilter(): void {
    this.filterType = 'All';
    if (this.selectedUserId) {
      this.filterType = 'User Track';
      this.mode = 'Details';
      const requestBody = {
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        filterType: 'User Track',
        filterId: this.selectedUserId
      };

      this.trackingService.getUserTrackDataReport(requestBody).subscribe((res) => {
        if (res.data?.length > 0) {
          this.detailData = res.data;
          this.displayedColumns1 = Object.keys(res.data[0]);
        }
      });
    }
    else {
      this.mode = 'All';
      this.loadData();
    }
  }

  onClear(): void {
    this.selectedUserId = null;
    this.fromDate = null;
    this.filterType = 'All';
  }

  openModel(popupData: any, headerName: string): void {
    var data = {
      result: popupData,
      headerName: headerName
    }
    this.dialog.open(PopupTableComponent, {
      data
    });
  }

  onUserTrack(id: any): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterType: 'User Track',
      filterId: id
    };

    this.trackingService.getUserTrackDataReport(requestBody).subscribe((res) => {
      const popupData = res.data;
      this.openModel(popupData, 'User Track');
    });
  }

  onAreasVisited(id: any): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterType: 'Areas Visited',
      filterId: id
    };

    this.trackingService.getAreasVisitedReport(requestBody).subscribe((res) => {
      const popupData = res.data;
      this.openModel(popupData, 'Areas Visited');
    });
  }

  onShopsVisited(id: any): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterType: 'Shops Visited',
      filterId: id
    };

    this.trackingService.getShopsVisitedReport(requestBody).subscribe((res) => {
      const popupData = res.data;
      this.openModel(popupData, 'Shops Visited');
    });
  }

  onShopsSimsGiven(id: any): void {

    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterType: 'Shops Sims Given',
      filterId: id
    };

    this.trackingService.getShopsSimsGivenReport(requestBody).subscribe((res) => {
      const popupData = res.data;
      this.openModel(popupData, 'Shops Sims Given');
    });
  }

  downloadAttendace(): void {
    if(this.selectedMonth){
    this.trackingService.downloadAttendace(this.selectedMonth);
    }
    else{
      this.toasterService.showMessage("Please select month.");
    }
  }


  // Handle Year Selection (no action needed)
  chosenYearHandler(normalizedYear: any) {
    // No action required, just wait for month selection
  }

  // Handle Month Selection
  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.selectedMonth = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
  }


}
