import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { ReportService } from '../../../services/report.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-cheque-withdrawn-report',
  templateUrl: './cheque-withdrawn-report.component.html',
  styleUrl: './cheque-withdrawn-report.component.scss'
})


export class ChequeWithdrawnReportComponent implements OnInit {

  displayedColumns: string[] = [
    'areaId',
    'name',
    'status',
  ];
  pageSize = PaginatorConstants.STANDARD_PAGE_SIZE;
  pageOptions = PaginatorConstants.STANDARD_PAGE_OPTIONS;
  pageNo = 0;
  totalCount = 0;
  chequeList: any[] = [];
  fromMonth: string | null = null;
  toMonth: string | null = null;


  constructor
    (
      private router: Router,
      private toasterService: ToasterService,
      public dialog: MatDialog,
      private reportService: ReportService
    ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const requestBody = {
      pageNo: this.pageNo + 1,
      pageSize: this.pageSize,
      fromDate: this.fromMonth,
      toDate: this.toMonth,
    };

    this.reportService.getChequeWithdrawnReport(requestBody).subscribe((res) => {
      if (res.data.results) {
        this.chequeList = res.data.results;
        this.totalCount = res.data.totalRecords;       
      }
      else {
        this.chequeList = [];
      }
    });
  }


  handlePageEvent(event: PageEvent): void {
    this.totalCount = event.length;
    this.pageNo = (this.pageSize === event.pageSize) ? event.pageIndex : 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.pageNo = 0;
    this.fromMonth = null;
    this.toMonth = null;
    this.loadData();
  }


  

  exportToExcel(): void {
    //this.reportService.exportToExcel();
  }

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

  chosenYearHandler(normalizedYear: any) {
    // No action required, just wait for month selection
  }

}
