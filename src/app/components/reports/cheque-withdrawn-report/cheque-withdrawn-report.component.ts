import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { ReportService } from '../../../services/report.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.fromMonth,
      toDate: this.toMonth,
    };

    this.reportService.getChequeWithdrawnReport(requestBody).subscribe((res) => {
      if (res.data) {
        this.chequeList = res.data;
        this.exportToExcel(this.chequeList, "cheques_withdrawn_" + this.fromMonth);
      }
      else {
        this.chequeList = [];
      }
    });
  }


  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.fromMonth = null;
    this.toMonth = null;
    this.chequeList = [];
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

  exportToExcel(jsonData: any[], fileName: string): void {
    // Convert JSON to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

    // Create workbook and add the worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };

    // Generate Excel buffer
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    // Save to file
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(data, `${fileName}.xlsx`);
  }


}
