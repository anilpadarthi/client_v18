import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-kpi-target-details',
  templateUrl: './kpi-target-details.component.html',
  styleUrl: './kpi-target-details.component.scss'
})

export class KpiTargetDetailsComponent implements OnInit {
  @Input() selectedDate: any;
  @Input() filterId: any;
  @Input() filterType: any;
  @Input() refreshCounter: any;
  activationList: any = [];
  private isFirstChange = true;
  isLoading = false;
  displayedColumns: string[] = [
    'Name',
    'PrevMonth',
    'CurrentMonth',
    'Target',
    'Percentage',
    'Act',
    'Rate',
    'Diff',
    'Total',
    'Bonus',
    'TotalCommission',
  ];
  dataSource: any = null;


  constructor(
    public datePipe: DatePipe,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    if (this.selectedDate) {
      this.loadData();
    }
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

  loadData(): void {
    this.isLoading = true;
    const request = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getUserWiseKPIReport(request).subscribe((res) => {
      this.activationList = res.data;
      this.isLoading = false;
    });
  }

  getTotal(column: string): any {
    if (column == 'Id') {
      return "";
    }
    else if (column == 'Name') {
      return "Total";
    }
    return this.activationList.reduce((sum: any, item: any) => sum + Number(item[column]), 0)
  }
}