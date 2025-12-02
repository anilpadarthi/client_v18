import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DownloadService } from '../../../services/download.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';


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
  selectedMonth: string | null = null;
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
  totalSum: number = 0;
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
    private reportService: ReportService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService,
    private toasterService: ToasterService,
    private downloadService: DownloadService
  ) { }

  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }

    if (userRole == 'Admin' || userRole == 'SuperAdmin' || userRole == 'Manager') {
      this.isDisplay = true;
      this.getAgentLookup();
      this.getManagerLookup();
    }
    else if (userRole == 'Agent') {
      this.selectedUserId = loggedInUserId;
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

  areaChange(): void {
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
    if (this.selectedMonth) {
      const requestBody = {
        fromDate: this.selectedMonth,
        areaId: this.selectedAreaId,
        shopId: this.selectedShopId,
        userId: this.selectedUserId,
        managerId: this.selectedManagerId,
        isInstantActivation: this.isInstantActivation,
      };
      this.reportService.getMonthlyActivations(requestBody).subscribe((res) => {
        if (res.data?.length > 0) {
          let result = res.data;
          result.forEach((e: any) => {
            e.total = e.ee + e.three + e.o2 + e.giffgaff + e.lebara + e.vodafone + e.voxi + e.smarty;
          });
          this.activationList = result;
          this.calculateSums();
        }
        else {
          this.activationList = [];
        }
      });
    }
    else {
      this.toasterService.showMessage("Please select any month");
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
    this.activationList = [];
  }

  calculateSums() {
    this.eeSum = this.activationList.reduce((sum: any, item: any) => sum + item.ee, 0);
    this.threeSum = this.activationList.reduce((sum: any, item: any) => sum + item.three, 0);
    this.o2Sum = this.activationList.reduce((sum: any, item: any) => sum + item.o2, 0);
    this.gifgafSum = this.activationList.reduce((sum: any, item: any) => sum + item.giffgaff, 0);
    this.vodafoneSum = this.activationList.reduce((sum: any, item: any) => sum + item.vodafone, 0);
    this.lebaraSum = this.activationList.reduce((sum: any, item: any) => sum + item.lebara, 0);
    this.lycaSum = this.activationList.reduce((sum: any, item: any) => sum + item.lyca, 0);
    this.voxiSum = this.activationList.reduce((sum: any, item: any) => sum + item.voxi, 0);
    this.smartySum = this.activationList.reduce((sum: any, item: any) => sum + item.smarty, 0);

    this.totalSum = this.eeSum + this.threeSum
      + this.o2Sum + this.gifgafSum
      + this.vodafoneSum + this.lebaraSum
      + this.voxiSum + this.smartySum;
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

  downloadDailyActivationList(): void {
    const requestBody = {
        fromDate: this.selectedMonth,
        areaId: this.selectedAreaId,
        shopId: this.selectedShopId,
        userId: this.selectedUserId,
        managerId: this.selectedManagerId,
        isInstantActivation: this.isInstantActivation,
      };
    this.downloadService.downloadDailyActivationList(requestBody);
  }

}