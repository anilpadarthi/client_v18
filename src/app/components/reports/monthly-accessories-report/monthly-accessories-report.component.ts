import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-monthly-accessories-report',
  templateUrl: './monthly-accessories-report.component.html',
  styleUrl: './monthly-accessories-report.component.scss'
})

export class MonthlyAccessoriesReportComponent implements OnInit {

  selectedMonth: string | null = null;
  selectedManagerId = null;
  bonusAmount = 0;
  managerLookup: any = [];
  activationList: any = [];
  isDisplay = false;
  displayedColumns: string[] = [
    'UserId',
    'UserName',
    'TotalOrderAmount',
    'TotalPaidAmount',
    'Action'
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
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplay = true;
      this.getManagerLookup();
    }
  }

  getManagerLookup() {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
    });
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: this.selectedManagerId
    };

    this.reportService.getMonthlyAccessoriesReport(requestBody).subscribe((res) => {
      if (res.data.length > 0) {
        this.activationList = res.data;
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