import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kpi-target-report',
  templateUrl: './kpi-target-report.component.html',
  styleUrl: './kpi-target-report.component.scss'
})

export class KpiTargetReportComponent implements OnInit {

  fromDate = null;
  selectedManagerId = null;
  bonusAmount = 0;
  managerLookup: any = [];
  kpiTargetList: any = [];
  isDisplay = false;
  displayedColumns: string[] = [
    'NAME',
    'PrevMonth',
    'KPI1',
    'KPI1Achieved',
    'AchievedPercentage',
    'Difference'
  ];

  constructor(
    public datePipe: DatePipe,
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
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterId: this.selectedManagerId
    };

    this.reportService.getKPITargetReport(requestBody).subscribe((res) => {
      this.kpiTargetList = res.data;
      if(this.kpiTargetList.length > 0){
        this.bonusAmount = this.kpiTargetList[0].kpI1Bonus;
      }
    });

  }

  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.fromDate = null;
    this.selectedManagerId = null;
  }

}