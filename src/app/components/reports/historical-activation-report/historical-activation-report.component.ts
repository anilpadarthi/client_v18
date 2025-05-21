import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { WebstorgeService } from '../../../services/web-storage.service';
import { FormControl } from '@angular/forms';

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
  fromMonth: string | null = null;
  toMonth: string | null = null;
  totalCount = 0;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  managerLookup: any = [];
  stickyColumns: string[] = ['Id', 'Name'];
  activationList: any = [];
  displayedColumns: string[] = [];
  isInstantActivation = false;
  isDisplay = false;
  isAdmin = false;
  areaFilterCtrl: FormControl = new FormControl();
  shopFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];
  filteredShops: any[] = [];
  userFilterCtrl: FormControl = new FormControl();
  managerFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  filteredManagers: any[] = [];

  constructor(
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private router: Router,
    private reportService: ReportService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService
  ) { }

  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;

    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplay = true;
      this.isAdmin = true;
      this.getAgentLookup();
      this.getManagerLookup();
    }
    else if (userRole == 'Manager') {
      this.isDisplay = true;
      this.selectedManagerId = loggedInUserId;
    }
    this.getAreaLookup();

    this.areaFilterCtrl.valueChanges.subscribe(() => {
      this.filterAreas();
    });
    this.shopFilterCtrl.valueChanges.subscribe(() => {
      this.filterShops();
    });

    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
    this.managerFilterCtrl.valueChanges.subscribe(() => {
      this.filterManagers();
    });

  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterManagers() {
    const search = this.managerFilterCtrl.value?.toLowerCase() || '';
    this.filteredManagers = this.managerLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterAreas() {
    const search = this.areaFilterCtrl.value?.toLowerCase() || '';
    this.filteredAreas = this.areaLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterShops() {
    const search = this.shopFilterCtrl.value?.toLowerCase() || '';
    this.filteredShops = this.shopLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  getManagerLookup() {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
      this.filteredManagers = res.data;
    });
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
      this.filteredAreas = res.data;
    });
  }

  areaChange() {
    this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
      this.shopLookup = res.data;
      this.filteredShops = res.data;
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
        fromDate: this.fromMonth,
        toDate: this.toMonth,
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

  // Handle Year Selection (no action needed)
  chosenYearHandler(normalizedYear: any) {
    // No action required, just wait for month selection
  }

  // Handle Month Selection
  choseFromMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.fromMonth = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
    return formattedMonth + "-01";
  }

  choseToMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.toMonth = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
  }

}