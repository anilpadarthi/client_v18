import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { ManagementService } from '../../../services/management.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SalaryTransactionEditorComponent } from '../salary-transaction-editor/salary-transaction-editor.component';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';



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
  salaryTransactions: any = [];
  isAdmin = false;
  isManager = false;
  userRole: any;
  loggedInUserId: any;
  kpi1Target = 0;
  kpi1Percentage = 0.00;
  userFilterCtrl: FormControl = new FormControl();
  managerFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  filteredManagers: any[] = [];
  selectedUserRole = '';

  displayedColumns: string[] = ['type', 'workingDays', 'salaryRate', 'total'];
  displayedColumns1: string[] = ['NetworkName', 'ActivationCount', 'Rate', 'Total'];
  displayedColumns2: string[] = ['saleType', 'totalSale', 'rate', 'total'];
  displayedColumns3: string[] = ['type', 'comments', 'date', 'amount', 'action'];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService,
    private managementService: ManagementService,
    private toasterService: ToasterService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
    this.loggedInUserId = this.webstorgeService.getUserInfo().userId;

    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin' || this.userRole == 'CallCenter') {
      this.isAdmin = true;
      this.getAgentLookup();
      this.getManagerLookup();
    }
    else if (this.userRole == 'Manager') {
      this.isManager = true;
      this.getAgentLookup();
    }
    else if (this.userRole == 'Agent') {
      this.selectedAgentId = this.loggedInUserId;
    }

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

  loadData(): void {
    if (this.selectedMonth && this.selectedUserRole != ''
      && (this.selectedManagerId != 0 || this.selectedAgentId != 0)) {
      const requestBody = {
        fromDate: this.selectedMonth,
        filterType: this.selectedAgentId != 0 ? 'Agent' : 'Manager',
        filterId: this.selectedManagerId != 0 ? this.selectedManagerId : this.selectedAgentId,
      };

      this.reportService.getSalaryReport(requestBody).subscribe((res) => {
        if (res.data != null) {
          this.simCommissionDetails = res.data.salarySimCommissionDetailsModel;
          this.accessoriesCommisssionDetails = res.data.salaryAccessoriesCommissionDetailsModel;
          this.salaryDetails = res.data.salaryDetailsModel;
          this.salaryTransactions = res.data.salaryTransactions;
          this.totalSalary = this.salaryDetails.reduce((sum: any, item: any) => sum + item.total, 0);
          this.totalActivations = this.simCommissionDetails.reduce((sum: any, item: any) => sum + item.activationCount, 0);
          this.totalSimCommission = this.simCommissionDetails.reduce((sum: any, item: any) => sum + item.total, 0);
          this.totalSaleAmount = this.accessoriesCommisssionDetails.reduce((sum: any, item: any) => sum + item.totalSale, 0);
          this.totalAccessoriesCommission = this.accessoriesCommisssionDetails.reduce((sum: any, item: any) => sum + item.total, 0);
          this.totalSalaryInAdvance = this.salaryTransactions.reduce((sum: any, item: any) => sum + item.amount, 0);
          this.kpi1Target = this.simCommissionDetails.length > 0 ? this.simCommissionDetails[0].kpI1Target : 0;
          this.kpi1Percentage = this.simCommissionDetails.length > 0 ? this.simCommissionDetails[0].kpI1AchivedPercentage : 0.00;
        }
      });
    }
    else {
      this.toasterService.showMessage('Please select Month and user to view the payslip.');
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
  }


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
    this.selectedAgentId = 0;
    this.selectedManagerId = 0;
    this.selectedUserRole = '';
    this.accessoriesCommisssionDetails = [];
    this.simCommissionDetails = [];
    this.salaryDetails = [];
  }

  addTransaction(): void {
    if ((this.selectedManagerId != 0 || this.selectedAgentId != 0) 
      && this.selectedMonth) {
      var data = {
        userId: this.selectedManagerId != 0 ? this.selectedManagerId : this.selectedAgentId,
        transactionDate: this.selectedMonth
      }
      this.dialog.open(SalaryTransactionEditorComponent, {
        data
      });
    }
    else {
      this.toasterService.showMessage("Please select user and month before to proceed.");
    }
  }

  editTransaction(userSalaryTransactionID: number): void {
    this.managementService.getUserSalaryTransaction(userSalaryTransactionID).subscribe((res) => {
      this.dialog.open(SalaryTransactionEditorComponent, {
        data: res.data
      });
    });
  }

  deleteTransaction(userSalaryTransactionID: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm?',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.managementService.deleteUserSalaryTransaction(userSalaryTransactionID).subscribe((res) => {
          if (res.statusCode == 200) {
            this.toasterService.showMessage("Deleted successfully");
            this.loadData();
          }
          else {
            this.toasterService.showMessage(res.data);
          }
        });
      }
    });
  }

  userRoleChanged(): void {
    this.selectedAgentId = 0;
    this.selectedManagerId = 0;
  }

}