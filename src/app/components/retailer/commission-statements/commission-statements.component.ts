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
  yearList: number[] = [];
  selectedYear = '';
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
    const currentYear = new Date().getFullYear();
    const startYear = 2018;

    for (let y = currentYear; y >= startYear; y--) {
      this.yearList.push(y);
    }
    this.loggedInUserId = this.webstorgeService.getUserInfo().userId;
  }

  loadData(): void {
    this.resultList = [];
    const requestBody = {
      fromDate: this.selectedYear + '-01-01',
      filterId: this.loggedInUserId
    };

    this.retailerService.getRetailerCommissionList(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {

        this.resultList = res.data.filter((item: any) => item.commissionAmount >= 12);
      }
      else {
        this.resultList = [];
      }
    });
  }

  downloadCommissionStatement(fromDate: string): void {
    this.commissionStatementService.downloadCommissionStatement(this.loggedInUserId, fromDate);
  }

  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedYear = '';
    this.resultList = [];
  }
}