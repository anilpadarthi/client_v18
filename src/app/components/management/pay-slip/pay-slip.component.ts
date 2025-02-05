import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrl: './pay-slip.component.scss'
})


export class PaySlipComponent implements OnInit {
  selectedMonth = '';
  selectedUserId = 0;
  totalCount = 0;
  userLookup: any = [];
  activationList: any = [];
  displayedColumns: string[] = [];
  isDisplay = false;
  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
    private lookupService: LookupService,
    private webstorgeService: WebstorgeService
  ) { }

  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'Super Admin') {
      this.isDisplay = true;
      this.getAgentLookup();
    }
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