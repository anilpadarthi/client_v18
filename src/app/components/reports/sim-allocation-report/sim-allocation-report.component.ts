import { Component, OnInit } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sim-allocation-report',
  templateUrl: './sim-allocation-report.component.html',
  styleUrl: './sim-allocation-report.component.scss'
})


export class SimAllocationReportComponent implements OnInit {
  selectedMonth = '';
  selectedUserId = 0;
  totalCount = 0;
  userLookup: any = [];
  activationList: any = [];
  displayedColumns: string[] = [];

  constructor(
    public datePipe: DatePipe,
    private router: Router,
    private reportService: ReportService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    this.getAgentLookup();

  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
    });
  }

  loadData(): void {

    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedMonth, 'yyyy-MM-dd'),
      filterId: this.selectedUserId
    };
    
    this.reportService.getSimAllocationReport(requestBody).subscribe((res) => {
      this.activationList = res.data;

      if (res.data.length > 0) {
        this.displayedColumns = Object.keys(res.data[0]);
      }
    });

  }


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = '';
    this.selectedUserId = 0;
  }

}