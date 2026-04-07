import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-low-stock-report',
  templateUrl: './low-stock-report.component.html',
  styleUrl: './low-stock-report.component.scss'
})

export class LowStockReportComponent implements OnInit {

  productList: any = [];



  displayedColumns: string[] = [
    'ProductName',
    'Quantity',
  ];

  constructor(
    public datePipe: DatePipe,
    private lookupService: LookupService,
    private reportService: ReportService,
    private toasterService: ToasterService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }





  loadData(): void {

    this.reportService.getLowStockReport().subscribe((res) => {
      if (res.data?.length > 0) {
       
        this.productList = res.data;
      }
      else {
        this.productList = [];
      }
    });

  }


}