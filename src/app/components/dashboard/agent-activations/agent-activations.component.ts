import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-agent-activations',
  templateUrl: './agent-activations.component.html',
  styleUrl: './agent-activations.component.scss'
})

export class AgentActivationsComponent implements OnInit {
  @Input() selectedDate: any;
  @Input() filterId: any;
  @Input() filterType: any;
  activationList: any = [];
  displayedColumns: string[] = [
    'Name',
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

    this.dashboardService.getUserWiseActivations(requestBody).subscribe((res) => {
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