




import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-monthly-accessories-commissioin-percent-report',
  templateUrl: './monthly-accessories-commissioin-percent-report.component.html',
  styleUrl: './monthly-accessories-commissioin-percent-report.component.scss'
})

export class MonthlyAccessoriesCommissioinPercentReportComponent implements OnInit {

  selectedMonth: string | null = null;
  selectedManagerId = null;
  selectedUserId = null;
  bonusAmount = 0;
  managerLookup: any = [];
  userLookup: any = [];
  activationList: any = [];
  isDisplay = false;
  isAdmin = false;
  userFilterCtrl: FormControl = new FormControl();
  managerFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  filteredManagers: any[] = [];

  displayedColumns: string[] = [
    'UserId',
    'UserName',
    '0P',
    '2.5P',
    '5P',
    '8P',
    'Total'
  ];

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private lookupService: LookupService,
    private reportService: ReportService,
    private webstorgeService: WebstorgeService
  ) { }


  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }

    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplay = true;
      this.getManagerLookup();
    }
    else if (userRole == 'Agent') {
      this.selectedUserId = loggedInUserId;
    }
    
    this.managerFilterCtrl.valueChanges.subscribe(() => {
      this.filterManagers();
    });
  }
  

  private filterManagers() {
    const search = this.managerFilterCtrl.value?.toLowerCase() || '';
    this.filteredManagers = this.managerLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getManagerLookup() {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
      this.filteredManagers = res.data;
    });
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: this.selectedManagerId
    };

    this.reportService.getMonthlyAccessoriesCommissionPercentReport(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        let result = res.data;
        result.forEach((e: any) => {
          e.total = e.p_0_00 + e.p_5_00 + e.p_2_50 + e.p_8_00;
        });
        this.activationList = result;
      }
      else {
        this.activationList = [];
      }
    });

  }

  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
    this.selectedManagerId = null;
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

  viewDetails(userId: number): void {
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: userId
    };
    this.reportService.getMonthlyAccessoriesReport(requestBody).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: 'Accessories Details'
      }
      this.dialog.open(PopupTableComponent, {
        data
      });
    });
  }



}