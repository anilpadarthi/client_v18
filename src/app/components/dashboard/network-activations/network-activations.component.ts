import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-network-activations',
  templateUrl: './network-activations.component.html',
  styleUrl: './network-activations.component.scss'
})

export class NetworkActivationsComponent implements OnInit {
  @Input() selectedDate: any;
  @Input() filterId: any;
  @Input() filterType: any;
  @Input() refreshCounter: any;
  activationList: any = [];
  instantActivationList: any = [];
  private isFirstChange = true;
  isLoading = false;
  displayedColumns: string[] = [
    'Network',
    'PreviousActivations',
    'DailyActivations',
    'IncreaseDailyActivations',
    'LastActivated'
  ];

  displayedInstantColumns: string[] = [
    'Network',
    'InstantActivations',
    'LastActivated'
  ];

  constructor(
    public datePipe: DatePipe,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    if (this.selectedDate != null) {
      this.loadData();
      this.loadInstantData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.isFirstChange) {
        this.isFirstChange = false; // Mark first change as handled
        return; // Skip logic on the first change detection pass
      }
  
      if (changes['selectedDate'] || changes['refreshCounter']) {
        this.loadData();
        this.loadInstantData();
      }
    }

  loadData(): void {
    this.isLoading = true;
    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getNetworkWiseActivations(requestBody).subscribe((res) => {
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

  getInstantTotal(column: string): any {
    if (column == 'Id') {
      return "";
    }
    else if (column == 'Name') {
      return "Total";
    }
    return this.instantActivationList.reduce((sum: any, item: any) => sum + Number(item[column]), 0)
  }

  loadInstantData(): void {
    this.isLoading = true;
    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getNetworkWiseInstantActivations(requestBody).subscribe((res) => {
      this.instantActivationList = res.data;
      this.isLoading = false;
    });
  }

}