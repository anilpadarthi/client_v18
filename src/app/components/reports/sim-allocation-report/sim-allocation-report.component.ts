import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sim-allocation-report',
  templateUrl: './sim-allocation-report.component.html',
  styleUrl: './sim-allocation-report.component.scss'
})


export class SimAllocationReportComponent implements OnInit {
  selectedMonth = null;
  selectedUserId = null;
  totalCount = 0;
  userLookup: any = [];
  activationList: any = [];
  displayedColumns: string[] = [];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
    private lookupService: LookupService,
    private toasterService: ToasterService
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
    if (this.selectedMonth && this.selectedUserId) {
      this.loadData();
    }
    else {
      this.toasterService.showMessage('Please select both Date and Agent to proceed further.')
    }
  }

  onClear(): void {
    this.selectedMonth = null;
    this.selectedUserId = null;
  }

}