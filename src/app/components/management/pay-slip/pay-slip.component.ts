import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';


@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrl: './pay-slip.component.scss'
})


export class PaySlipComponent implements OnInit {
  selectedMonth: string | null = null;
  selectedAgentId = 0;
  selectedManagerId = 0;
  totalSalaryInAdvance = 0.00;
  totalSalary = 0.00;
  totalActivations = 0;
  totalSimCommission = 0.00;
  totalSaleAmount = 0.00;
  totalAccessoriesCommission = 0.00;
  userLookup: any = [];
  managerLookup: any = [];
  accessoriesCommisssionDetails: any = [];
  simCommissionDetails: any = [];
  salaryDetails: any = [];
  salaryInAdvance: any = [];
  isAdmin = false;
  userRole: any;
  loggedInUserId: any;
  kpi1Target = 0;
  kpi1Percentage = 0.00;

  displayedColumns: string[] = ['type', 'workingDays', 'salaryRate', 'total'];
  displayedColumns1: string[] = ['NetworkName', 'ActivationCount','Rate', 'Total'];
  displayedColumns2: string[] = ['saleType', 'totalSale', 'rate', 'total'];
  displayedColumns3: string[] = ['comments', 'date', 'amount'];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService
  ) { }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
    this.loggedInUserId = this.webstorgeService.getUserInfo().userId;

    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
      this.isAdmin = true;
      this.getAgentLookup();
      this.getManagerLookup();
    }
    else if (this.userRole == 'Manager') {
      this.selectedManagerId = this.loggedInUserId;
    }
    else if (this.userRole == 'Agent') {
      this.selectedAgentId = this.loggedInUserId;
    }

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

  loadData(): void {
    const requestBody = {
      fromDate: this.selectedMonth,
      filterType: this.selectedManagerId != 0 ? 'Manager' : 'Agent',
      filterId: this.selectedManagerId != 0 ? this.selectedManagerId : this.selectedAgentId,
    };

    this.reportService.getSalaryReport(requestBody).subscribe((res) => {
      if (res.data != null) {
        this.simCommissionDetails = res.data.salarySimCommissionDetailsModel;
        this.accessoriesCommisssionDetails = res.data.salaryAccessoriesCommissionDetailsModel;
        this.salaryDetails = res.data.salaryDetailsModel;
        this.salaryInAdvance = res.data.salaryInAdvanceModel;
        this.totalSalary = this.salaryDetails.reduce((sum: any, item: any) => sum + item.total, 0);
        this.totalActivations = this.simCommissionDetails.reduce((sum: any, item: any) => sum + item.activationCount, 0);
        this.totalSimCommission = this.simCommissionDetails.reduce((sum: any, item: any) => sum + item.total, 0);
        this.totalSaleAmount = this.accessoriesCommisssionDetails.reduce((sum: any, item: any) => sum + item.totalSale, 0);
        this.totalAccessoriesCommission = this.accessoriesCommisssionDetails.reduce((sum: any, item: any) => sum + item.total, 0);
        this.totalSalaryInAdvance = this.salaryInAdvance.reduce((sum: any, item: any) => sum + item.amount, 0);
        this.kpi1Target = this.simCommissionDetails.length > 0 ? this.simCommissionDetails[0].kpI1Target : 0;
        this.kpi1Percentage = this.simCommissionDetails.length > 0 ? this.simCommissionDetails[0].kpI1AchivedPercentage : 0.00;
      }
    });

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


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
    this.selectedAgentId = 0;
    this.selectedManagerId = 0;
    this.accessoriesCommisssionDetails = [];
    this.simCommissionDetails = [];
    this.salaryDetails = [];
  }

}