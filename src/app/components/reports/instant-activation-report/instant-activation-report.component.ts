import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-instant-activation-report',
  templateUrl: './instant-activation-report.component.html',
  styleUrl: './instant-activation-report.component.scss'
})


export class InstantActivationReportComponent implements OnInit {

  fromDate = null;
  resultList: any = [];
  displayedColumns: string[] = [
    'ID',
    'NAME',
    'EE',
    'THREE',
    'O2',
    'GIFFGAFF',
    'VODAFONE',
    'LEBARA',
    'LYCA',
    'VOXI',
    'SMARTY',
    'TOTAL'
  ];

  eeSum: number = 0;
  threeSum: number = 0;
  o2Sum: number = 0;
  gifgafSum: number = 0;
  vodafoneSum: number = 0;
  lebaraSum: number = 0;
  lycaSum: number = 0;
  voxiSum: number = 0;
  smartySum: number = 0;
  totalSum: number = 0;


  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {   
  }

  calculateSums() {
    this.eeSum = this.resultList.reduce((sum: any, item: any) => sum + item.ee, 0);
    this.threeSum = this.resultList.reduce((sum: any, item: any) => sum + item.three, 0);
    this.o2Sum = this.resultList.reduce((sum: any, item: any) => sum + item.o2, 0);
    this.gifgafSum = this.resultList.reduce((sum: any, item: any) => sum + item.giffgaff, 0);
    this.vodafoneSum = this.resultList.reduce((sum: any, item: any) => sum + item.vodafone, 0);
    this.lebaraSum = this.resultList.reduce((sum: any, item: any) => sum + item.lebara, 0);
    this.lycaSum = this.resultList.reduce((sum: any, item: any) => sum + item.lyca, 0);
    this.voxiSum = this.resultList.reduce((sum: any, item: any) => sum + item.voxi, 0);
    this.smartySum = this.resultList.reduce((sum: any, item: any) => sum + item.smarty, 0);

    this.totalSum = this.eeSum + this.threeSum
      + this.o2Sum + this.gifgafSum
      + this.vodafoneSum + this.lebaraSum
      + this.voxiSum + this.smartySum;
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
    };
    this.reportService.getInstantActivationReport(requestBody).subscribe((res) => {
      console.log(res.data);
      this.resultList = res.data;
      if(this.resultList?.length > 0){
        this.resultList.forEach((e: any) => {
          e.total = e.ee + e.three + e.o2 + e.giffgaff + e.lebara + e.vodafone + e.voxi + e.smarty;
        });
        this.calculateSums();
      }
    });
  }


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.fromDate = null;
  }
}