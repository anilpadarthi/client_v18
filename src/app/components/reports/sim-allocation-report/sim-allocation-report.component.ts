import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sim-allocation-report',
  templateUrl: './sim-allocation-report.component.html',
  styleUrl: './sim-allocation-report.component.scss'
})


export class SimAllocationReportComponent implements OnInit {

  selectedMonth: string | null = null;
  selectedUserId = null;
  totalCount = 0;
  totalAssignedToShop = 0;
  totalAssignedToAgent = 0;
  totalDifference = 0;
  lastMonthTotalActivations = 0;
  totalFreeAllocations = 0;
  userLookup: any = [];
  activationList: any = [];
  userFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];

  displayedColumns: string[] = [
    'Name',
    'LastMonthActivaitons',
    'FreeAllocations',
    'AssignedToAgent',
    'AssignedToShop',
    'Difference',
  ];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
    private lookupService: LookupService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.getAgentLookup();
    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });

  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  loadData(): void {

    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: this.selectedUserId
    };

    this.reportService.getSimAllocationReport(requestBody).subscribe((res) => {
      this.activationList = res.data;

      if (res.data.length > 0) {
        this.totalAssignedToAgent = this.activationList.reduce((sum: any, item: any) => sum + item.allocatedToAgent, 0);
        this.totalAssignedToShop = this.activationList.reduce((sum: any, item: any) => sum + item.allocatedToShop, 0);
        this.totalDifference = this.activationList.reduce((sum: any, item: any) => sum + item.difference, 0);
        this.lastMonthTotalActivations = this.activationList.reduce((sum: any, item: any) => sum + item.lastMonthActivations, 0);
        this.totalFreeAllocations = this.activationList.reduce((sum: any, item: any) => sum + item.freeAllocations, 0);
      }
    });

  }


  onFilter(): void {
    if (this.selectedMonth && this.selectedUserId) {
      this.loadData();
    }
    else {
      this.toasterService.showMessage('Please select both Date and Agent to proceed further.')
    }
  }

  onClear(): void {
    this.selectedMonth = null;
    this.selectedUserId = null;
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