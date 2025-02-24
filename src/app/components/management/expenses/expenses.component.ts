import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})

export class ExpensesComponent implements OnInit {

  fromDate = null;
  selectedManagerId = null;
  bonusAmount = 0;
  managerLookup: any = [];
  atttendanceList: any = [];
  isDisplay = false;
  displayedColumns: string[] = [
    'NAME',
    'PrevMonth',
    'KPI1',
    'KPI1Achieved',
    'AchievedPercentage',
    'Difference'
  ];

  constructor(
    public datePipe: DatePipe,
    private lookupService: LookupService,
    private reportService: ReportService,
    private webstorgeService: WebstorgeService
  ) { }


  ngOnInit(): void {
    
  }  

  loadData(): void {

    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      filterId: this.selectedManagerId
    };

    this.reportService.getKPITargetReport(requestBody).subscribe((res) => {
      this.atttendanceList = res.data;      
    });

  }

  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.fromDate = null;
    this.selectedManagerId = null;
  }

}