import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sim-allocation-details',
  templateUrl: './sim-allocation-details.component.html',
  styleUrl: './sim-allocation-details.component.scss'
})


export class SimAllocationDetailsComponent implements OnInit {

  @Input() selectedDate: any;
  @Input() filterId: any;
  @Input() refreshCounter: any;
  totalCount = 0;
  totalAssignedToShop = 0;
  totalAssignedToAgent = 0;
  totalDifference = 0;
  lastMonthTotalActivations = 0;
  totalFreeAllocations = 0;
  totalCarryForward = 0;
  userLookup: any = [];
  activationList: any = [];
  userFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  private isFirstChange = true;

  displayedColumns: string[] = [
    'Name',
    'LastMonthActivaitons',
    'FreeAllocations',
    'CarryForward',
    'GivenToAgent',
    'AssignedToShop',
    'TotalLeft',
  ];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    if (this.selectedDate) {
      this.loadData();
    }
  }

  loadData(): void {

    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId
    };

    this.reportService.getSimAllocationReport(requestBody).subscribe((res) => {
      this.activationList = res.data;

      if (res.data?.length > 0) {
        this.totalAssignedToAgent = this.activationList.reduce((sum: any, item: any) => sum + item.givenToAgent, 0);
        this.totalAssignedToShop = this.activationList.reduce((sum: any, item: any) => sum + item.allocatedToShop, 0);
        this.totalDifference = this.activationList.reduce((sum: any, item: any) => sum + item.totalLeft, 0);
        this.lastMonthTotalActivations = this.activationList.reduce((sum: any, item: any) => sum + item.lastMonthActivations, 0);
        this.totalFreeAllocations = this.activationList.reduce((sum: any, item: any) => sum + item.freeAllocations, 0);
        this.totalCarryForward = this.activationList.reduce((sum: any, item: any) => sum + item.carryForward, 0);
      }
      else {
        this.activationList = [];
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false; // Mark first change as handled
      return; // Skip logic on the first change detection pass
    }

    if (changes['selectedDate'] || changes['refreshCounter']) {
      this.loadData();
    }
  }


}