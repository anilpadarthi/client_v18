import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-monthly-activation-report',
  templateUrl: './monthly-activation-report.component.html',
  styleUrl: './monthly-activation-report.component.scss'
})


export class MonthlyActivationReportComponent implements OnInit {

  selectedAreaId = null;
  selectedShopId = null;
  selectedUserId = null;
  selectedManagerId = null;
  selectedMonth = null;
  isInstantActivation = false;
  totalCount = 0;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  managerLookup: any = [];
  activationList: any = [];
  allItem: any = [{ 'id:': null, 'name': 'All' }];

  eeSum: number = 0;
  threeSum: number = 0;
  o2Sum: number = 0;
  gifgafSum: number = 0;
  vodafoneSum: number = 0;
  lebaraSum: number = 0;
  lycaSum: number = 0;
  voxiSum: number = 0;
  smartySum: number = 0;

  displayedColumns: string[] = [
    'ID',
    'NAME',
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFFGAFF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
    'TOTAL'
  ];

  constructor(
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private reportService: ReportService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    this.getAreaLookup();
    this.getAgentLookup();
    this.getManagerLookup();
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
    });
  }

  getManagerLookup() {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
    });
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
    });
  }

  areaChange(): void {
    this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
      this.shopLookup = res.data;
      this.selectedShopId = null;
    });
  }

  managerChange(): void {
    this.selectedUserId = null;
  }

  agentChange(): void {
    this.selectedManagerId = null;
  }

  loadData(): void {
    if (this.selectedMonth) {
      const requestBody = {
        fromDate: this.datePipe.transform(this.selectedMonth, 'yyyy-MM-dd'),
        areaId: this.selectedAreaId,
        shopId: this.selectedShopId,
        userId: this.selectedUserId,
        managerId: this.selectedManagerId,
        isInstantActivation: this.isInstantActivation,
      };
      this.reportService.getMonthlyActivations(requestBody).subscribe((res) => {
        this.activationList = res.data;
        this.calculateSums();
      });
    }
    else {
      this._snackBar.open("Please select any month");
    }
  }

  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedAreaId = null;
    this.selectedShopId = null;
    this.selectedUserId = null;
    this.selectedMonth = null;
    this.selectedManagerId = null;
    this.isInstantActivation = false;
  }

  calculateSums() {
    this.eeSum = this.activationList.reduce((sum: any, item: any) => sum + item.ee, 0);
    this.threeSum = this.activationList.reduce((sum: any, item: any) => sum + item.three, 0);
    this.o2Sum = this.activationList.reduce((sum: any, item: any) => sum + item.o2, 0);
    this.gifgafSum = this.activationList.reduce((sum: any, item: any) => sum + item.gifgaf, 0);
    this.vodafoneSum = this.activationList.reduce((sum: any, item: any) => sum + item.vodafone, 0);
    this.lebaraSum = this.activationList.reduce((sum: any, item: any) => sum + item.lebara, 0);
    this.lycaSum = this.activationList.reduce((sum: any, item: any) => sum + item.lyca, 0);
    this.voxiSum = this.activationList.reduce((sum: any, item: any) => sum + item.voxi, 0);
    this.smartySum = this.activationList.reduce((sum: any, item: any) => sum + item.smarty, 0);
  }

}