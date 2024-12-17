import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-historical-activation-report',
  templateUrl: './historical-activation-report.component.html',
  styleUrl: './historical-activation-report.component.scss'
})


export class HistoricalActivationReportComponent implements OnInit {

  selectedAreaId = null;
  selectedShopId = null;
  selectedUserId = null;
  selectedManagerId = null;
  fromMonth = null;
  toMonth = null;
  totalCount = 0;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  managerLookup: any = [];
  stickyColumns: string[] = ['Id', 'Name'];
  activationList: any = [];
  displayedColumns: string[] = [];
  isInstantActivation = false;

  constructor(
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private router: Router,
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

  areaChange() {
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

    if (this.fromMonth) {
      const requestBody = {
        fromDate: this.datePipe.transform(this.fromMonth, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toMonth, 'yyyy-MM-dd'),
        areaId: this.selectedAreaId,
        shopId: this.selectedShopId,
        userId: this.selectedUserId,
        managerId: this.selectedManagerId,
        isInstantActivation: this.isInstantActivation,
      };
      this.reportService.getMonthlyHistoryActivations(requestBody).subscribe((res) => {

        if (res.data.length > 0) {
          this.displayedColumns = Object.keys(res.data[0]);
          this.activationList = res.data;
        }
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
    this.selectedManagerId = null;
    this.fromMonth = null
    this.toMonth = null
    this.isInstantActivation = false;
  }

  getTotal(column: string): any {
    if (column == 'Id') {
      return "";
    }
    else if (column == 'Name') {
      return "Total";
    }
    return this.activationList.reduce((sum: any, item: any) => sum + Number(item[column]), 0)
  }

}