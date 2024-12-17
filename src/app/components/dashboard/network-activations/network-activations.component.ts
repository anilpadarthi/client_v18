import { Component, OnInit, Input } from '@angular/core';
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
  activationList: any = [];
  displayedColumns: string[] = [
    'Network',
    'DailyActivations',
    'InstantActivations',
    'LastActivated',
    'Total'
  ];

  constructor(
    public datePipe: DatePipe,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    if (this.selectedDate != null) {
      this.loadData();
    }
  }

  ngOnChanges(): void {
    if (this.selectedDate != null) {
      this.loadData();
    }
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getNetworkWiseActivations(requestBody).subscribe((res) => {
      this.activationList = res.data;
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