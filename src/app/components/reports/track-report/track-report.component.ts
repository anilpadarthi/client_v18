import { Component, OnInit } from '@angular/core';
import { TrackingService } from '../../../services/tracking.service';
import { LookupService } from '../../../services/lookup.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';

@Component({
  selector: 'app-track-report',
  templateUrl: './track-report.component.html',
  styleUrl: './track-report.component.scss'
})


export class TrackReportComponent implements OnInit {

  fromDate: any = null;
  filterType = 'All';
  selectedUserId = null;
  totalCount = 0;
  isOpenModel = false;
  userLookup: any = [];
  dataSource: any = [];
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
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {    
    this.getUserLookup();
  }

  getUserLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
    });
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterType: this.filterType,
      filterId: this.selectedUserId
    };

    this.trackingService.getTrackReport(requestBody).subscribe((res) => {
      this.dataSource = res.data;
    });
  }

  onFilter(): void {
    this.filterType = 'All';
    if (this.selectedUserId) {
      this.filterType = 'User Track';
    }
    this.loadData();
  }

  onClear(): void {
    this.selectedUserId = null;
    this.fromDate = null;
    this.filterType = 'All';
  }

  openModel(popupData: any, headerName: string): void {
    var data ={
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
      this.openModel(popupData,'Areas Visited');
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
      this.openModel(popupData,'Shops Visited');
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
      this.openModel(popupData,'Shops Sims Given');
    });
  }

}
