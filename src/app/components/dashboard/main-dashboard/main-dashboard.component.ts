import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})

export class MainDashboardComponent implements OnInit {

  selectedMonth: string | null = null;
  selectedUserId = null;
  selectedManagerId = null;
  userLookup: any = [];
  managerLookup: any = [];
  dashboardViewMode = '';
  isManager = false;
  isAdmin = false;
  givenCount = 0;
  assignedCount = 0;
  activationCount = 0;
  instantActivationCount = 0;
  filterId: any = null;
  filterType: any = null;
  refreshCounter = 0;
  isLoading = false;
  userFilterCtrl: FormControl = new FormControl();
  managerFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  filteredManagers: any[] = [];

  constructor(
    private webstorgeService: WebstorgeService,
    private lookupService: LookupService,
    private dashboardService: DashboardService,
    private toasterService: ToasterService,
    private datePipe: DatePipe,
  ) { }


  ngOnInit(): void {

    let userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;
    this.filterId = loggedInUserId;
    this.filterType = userRole;
    this.selectedMonth = this.getCurrentMonthString();
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isAdmin = true;
      this.dashboardViewMode = 'Admin'
      this.getAgentLookup();
      this.getManagerLookup();
    }
    else if (userRole == 'Manager') {
      this.isManager = true;
      this.dashboardViewMode = 'Manager'
      this.getAgentLookup();
    }
    else if (userRole == 'Agent') {
      this.dashboardViewMode = 'Agent'
    }

    this.loadDashboardMetrics();

    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
    this.managerFilterCtrl.valueChanges.subscribe(() => {
      this.filterManagers();
    });
  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item:any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterManagers() {
    const search = this.managerFilterCtrl.value?.toLowerCase() || '';
    this.filteredManagers = this.managerLookup.filter((item:any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup(): void {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  getManagerLookup(): void {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
      this.filteredManagers = res.data;
    });
  }

  onManagerChanged(): void {
    this.selectedUserId = null;
  }

  loadDashboardMetrics(): void {
    this.isLoading = true;
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getDahboardMetrics(requestBody).subscribe((res) => {
      this.isLoading = false;
      if (res.data?.length > 0) {
        this.assignedCount = res.data[0].assignedCount;
        this.givenCount = res.data[0].givenToShopCount;
        this.activationCount = res.data[0].activationCount;
        this.instantActivationCount = res.data[0].instantActivationCount;
      }
    });
  }

  onSubmit(): void {

    if (this.selectedMonth == null) {
      this.toasterService.showMessage('Please select any month before to proceed.');
    }
    else {
      this.refreshCounter++;
      if (this.selectedUserId) {
        this.dashboardViewMode = 'Agent';
        this.filterId = this.selectedUserId;
        this.filterType = 'Agent';
      }
      else if (this.selectedManagerId) {
        this.dashboardViewMode = 'Manager';
        this.filterId = this.selectedManagerId;
        this.filterType = 'Manager';
      }
      this.loadDashboardMetrics();
    }
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
    this.loadDashboardMetrics();
  }

  getCurrentMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
  return `${year}-${month}-01`;
}

}
