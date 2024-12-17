import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.scss'
})


export class DailyReportComponent implements OnInit {

  fromDate = null;
  resultList: any = [];
  displayedColumns: string[] = [
    'ID',
    'NAME',
    'EE',
    'THREE',
    'O2',
    'GIFGAF',
    'VODAFONE',
    'LEBARA',
    'LYCA',
    'VOXI',
    'SMARTY',
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
    this.gifgafSum = this.resultList.reduce((sum: any, item: any) => sum + item.gifgaf, 0);
    this.vodafoneSum = this.resultList.reduce((sum: any, item: any) => sum + item.vodafone, 0);
    this.lebaraSum = this.resultList.reduce((sum: any, item: any) => sum + item.lebara, 0);
    this.lycaSum = this.resultList.reduce((sum: any, item: any) => sum + item.lyca, 0);
    this.voxiSum = this.resultList.reduce((sum: any, item: any) => sum + item.voxi, 0);
    this.smartySum = this.resultList.reduce((sum: any, item: any) => sum + item.smarty, 0);
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
    };
    this.reportService.getDailyGivenCount(requestBody).subscribe((res) => {
      this.resultList = res.data;
      if(this.resultList.length > 0){
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