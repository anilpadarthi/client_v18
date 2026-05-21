import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../../../services/management.service';
import { DownloadService } from '../../../services/download.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-accessories-outstanding-report',
  templateUrl: './accessories-outstanding-report.component.html',
  styleUrl: './accessories-outstanding-report.component.scss'
})


export class AccessoriesOutstandingReportComponent implements OnInit {

  selectedAreaId = null;
  selectedShopId = null;
  selectedUserId = null;
  selectedManagerId = null;
  selectedMonth: any = null;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  managerLookup: any = [];
  outStandingList: any = [];
  allItem: any = [{ 'id:': null, 'name': 'All' }];
  areaFilterCtrl: FormControl = new FormControl();
  shopFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];
  filteredShops: any[] = [];
  userFilterCtrl: FormControl = new FormControl();
  managerFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  filteredManagers: any[] = [];
  isAdmin = false;

  displayedColumns = [
    'userName',
    'totalSale',
    'totalCollectedAmount',
    'outstandingBalance'
  ];

  constructor(
    private datePipe: DatePipe,
    private managementService: ManagementService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService,
    private toasterService: ToasterService,
    private downloadService: DownloadService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // let userRole = this.webstorgeService.getUserRole();
    // let loggedInUserId = this.webstorgeService.getUserInfo().userId;

    // if (userRole == 'Admin' || userRole == 'SuperAdmin') {
    //   this.isAdmin = true;
    // }
    // this.getAgentLookup();
    // this.getManagerLookup();
    // this.getAreaLookup();

    // this.areaFilterCtrl.valueChanges.subscribe(() => {
    //   this.filterAreas();
    // });
    // this.shopFilterCtrl.valueChanges.subscribe(() => {
    //   this.filterShops();
    // });

    // this.userFilterCtrl.valueChanges.subscribe(() => {
    //   this.filterUsers();
    // });
    // this.managerFilterCtrl.valueChanges.subscribe(() => {
    //   this.filterManagers();
    // });
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
      `${item.oldId} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterShops() {
    const search = this.shopFilterCtrl.value?.toLowerCase() || '';
    this.filteredShops = this.shopLookup.filter((item: any) =>
      `${item.oldId} - ${item.name}`.toLowerCase().includes(search)
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
      };

      this.managementService.outStandingAccessoriesReport(requestBody).subscribe((res) => {
        if (res.data?.length > 0) {
          let result = res.data;
          this.outStandingList = result;
        }
        else {
          this.outStandingList = [];
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
    this.outStandingList = [];
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