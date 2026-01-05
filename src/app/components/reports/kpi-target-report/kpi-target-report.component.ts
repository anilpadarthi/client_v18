import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-kpi-target-report',
  templateUrl: './kpi-target-report.component.html',
  styleUrl: './kpi-target-report.component.scss'
})

export class KpiTargetReportComponent implements OnInit {

  selectedMonth: string | null = null;
  selectedManagerId = null;
  bonusAmount = 0;
  managerLookup: any = [];
  kpiTargetList: any = [];
  accessorieskpiTargetList: any = [];
  isDisplay = false;
  managerFilterCtrl: FormControl = new FormControl();
  filteredManagers: any[] = [];
  prevTotal: number = 0;
  KPI1TargetTotal: number = 0;
  KPI1AchievedTotal: number = 0;
  achievedPercentageTotal: any;
  differenceTotal: number = 0;

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

    this.reportService.getKPITargetReport(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.kpiTargetList = res.data;
        if (this.kpiTargetList.length > 0) {
          this.bonusAmount = this.kpiTargetList[0].kpI1Bonus;
          this.calculateSums();
        }
      }
      else {
        this.kpiTargetList = [];
      }
    });

  }

  loadAccessoriesData(): void {
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: this.selectedManagerId
    };

    this.reportService.getAccessoriesKPITargetReport(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.accessorieskpiTargetList = res.data;
        if (this.accessorieskpiTargetList.length > 0) {
          this.bonusAmount = this.accessorieskpiTargetList[0].kpI1Bonus;
          this.calculateAccessoriesSums();
        }
      }
      else {
        this.accessorieskpiTargetList = [];
      }
    });

  }

  onFilter(): void {
    this.loadData();
    //this.loadAccessoriesData();
  }

  onClear(): void {
    this.selectedMonth = null;
    this.selectedManagerId = null;
    this.kpiTargetList = [];
    this.accessorieskpiTargetList = [];
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

  calculateSums() {
    this.prevTotal = this.kpiTargetList.reduce((sum: any, item: any) => sum + item.lastMonthActivated, 0);
    this.KPI1TargetTotal = this.kpiTargetList.reduce((sum: any, item: any) => sum + item.kpI1Activations, 0);
    this.KPI1AchievedTotal = this.kpiTargetList.reduce((sum: any, item: any) => sum + item.achieved, 0);
    this.achievedPercentageTotal = (this.KPI1AchievedTotal && this.KPI1TargetTotal ? (this.KPI1AchievedTotal / this.KPI1TargetTotal) * 100 : 0).toFixed(2);
    this.differenceTotal = this.KPI1TargetTotal - this.KPI1AchievedTotal;
  }

  calculateAccessoriesSums() {
    this.prevTotal = this.kpiTargetList.reduce((sum: any, item: any) => sum + item.lastMonthActivated, 0);
    this.KPI1TargetTotal = this.kpiTargetList.reduce((sum: any, item: any) => sum + item.kpI1Activations, 0);
    this.KPI1AchievedTotal = this.kpiTargetList.reduce((sum: any, item: any) => sum + item.achieved, 0);
    this.achievedPercentageTotal = (this.KPI1AchievedTotal && this.KPI1TargetTotal ? (this.KPI1AchievedTotal / this.KPI1TargetTotal) * 100 : 0).toFixed(2);
    this.differenceTotal = this.KPI1TargetTotal - this.KPI1AchievedTotal;
  }

}