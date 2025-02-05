import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
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
  @Input() refreshCounter: any;
  private isFirstChange = true;
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