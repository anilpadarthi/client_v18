import { Component, OnInit } from '@angular/core';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})

export class MainDashboardComponent implements OnInit {
  selectedDate: any = null;
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

  constructor(
    private webstorgeService: WebstorgeService,
    private lookupService: LookupService,
    private dashboardService: DashboardService,
    private toasterService: ToasterService,
    private datePipe: DatePipe,
  ) { }


  ngOnInit(): void {
    this.selectedDate = "2024-07-01";
    this.getAgentLookup();
    this.getManagerLookup();
    let userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId
    this.filterId = loggedInUserId;
    this.filterType = userRole;

    if (userRole == 'Admin') {
      this.isAdmin = true;
      this.dashboardViewMode = 'Admin'
    }
    else if (userRole == 'Manager') {
      this.isManager = true;
      this.dashboardViewMode = 'Manager'
    }
    else if (userRole == 'Agent') {
      this.dashboardViewMode = 'Agent'
    }

    this.loadDashboardMetrics();
  }

  getAgentLookup(): void {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
    });
  }

  getManagerLookup(): void {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
    });
  }

  onManagerChanged(): void {
    this.selectedUserId = null;
  }

  loadDashboardMetrics(): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getDahboardMetrics(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.assignedCount = res.data[0].assignedCount;
        this.givenCount = res.data[0].givenToShopCount;
        this.activationCount = res.data[0].activationCount;
        this.instantActivationCount = res.data[0].instantActivationCount;
      }
    });
  }

  onSubmit(): void {
    if (this.selectedDate == null) {
      this.toasterService.showMessage('Please select any month before to proceed.');
    }
    else {
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
  
}
