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
  accessoriesList: any = [];
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
      //this.loadAccessoriesData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false; // Mark first change as handled
      return; // Skip logic on the first change detection pass
    }

    if (changes['selectedDate'] || changes['refreshCounter']) {
      this.loadData();
      //this.loadAccessoriesData();
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

  

  loadAccessoriesData(): void {
    this.isLoading = true;
    const request = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getUserWiseAccessoriesKPIReport(request).subscribe((res) => {
      this.accessoriesList = res.data;
      this.isLoading = false;
    });
  }

}