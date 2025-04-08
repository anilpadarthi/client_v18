import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';


@Component({
  selector: 'app-network-report',
  templateUrl: './network-report.component.html',
  styleUrl: './network-report.component.scss'
})

export class NetworkReportComponent implements OnInit {

  selectedMonth: string | null = null;
  totalCount = 0;
  networkUsageList: any = [];
  displayedColumns: string[] = [
    'NAME',
    'GIVEN',
    'ACTIVATED',
  ];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.selectedMonth
    };

    this.reportService.getNetworkUsageReport(requestBody).subscribe((res) => {
      this.networkUsageList = res.data;
    });
  }


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
  }

  get totalGiven(): number {
    return this.networkUsageList.reduce((sum: any, item: any) => sum + item.given, 0);
  }

  get totalActivated(): number {
    return this.networkUsageList.reduce((sum: any, item: any) => sum + item.activated, 0);
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