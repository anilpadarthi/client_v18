import { Component, OnInit } from '@angular/core';
import { RetailerService } from '../../../services/retailer.service';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../../services/web-storage.service';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';


@Component({
  selector: 'app-commission-statements',
  templateUrl: './commission-statements.component.html',
  styleUrl: './commission-statements.component.scss'
})

export class CommissionStatementsComponent implements OnInit {

  selectedMonth: string | null = null;
  totalCount = 0;
  resultList: any[] = [];
  loggedInUserId = 0;
  displayedColumns: string[] = [
    'CommissionDate',
    'CommissionAmount',
    'Action'
  ];

  constructor(
    public datePipe: DatePipe,
    private retailerService: RetailerService,
    private webstorgeService: WebstorgeService,
    private commissionStatementService: CommissionStatementService
  ) { }

  ngOnInit(): void {
    this. loggedInUserId = this.webstorgeService.getUserInfo().userId;
  }



  loadData(): void {
    
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: this.loggedInUserId
    };

    this.retailerService.getRetailerCommissionList(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.resultList = res.data;
      }
      else {
        this.resultList = [];
      }
    });
  }

  downloadCommissionStatement( fromDate: string): void {
    this.commissionStatementService.downloadCommissionStatement(this.loggedInUserId, fromDate);
  }



  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
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