import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-network-report',
  templateUrl: './network-report.component.html',
  styleUrl: './network-report.component.scss'
})

export class NetworkReportComponent implements OnInit {
  selectedMonth = null;
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
      fromDate: this.datePipe.transform(this.selectedMonth, 'yyyy-MM-dd'),
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

}