import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-agent-accessories',
  templateUrl: './agent-accessories.component.html',
  styleUrl: './agent-accessories.component.scss'
})

export class AgentAccessoriesComponent implements OnInit {
  @Input() selectedDate: any;
  @Input() filterId: any;
  @Input() filterType: any;
  activationList: any = [];
  @Input() refreshCounter: any;
  private isFirstChange = true;
  isLoading = false;
  displayedColumns: string[] = [
    'Name',
    'AC',
    'Bonus',
    'COD',
    'InstantBonus',
    'MC',
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
    this.isLoading = true;
    const requestBody = {
      fromDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      filterId: this.filterId,
      filterType: this.filterType
    };

    this.dashboardService.getUserWiseAccessoriesSales(requestBody).subscribe((res) => {

      if (res.data != null && res.data.length > 0) {
        res.data.forEach((e: any) => {
          e.cod = (Number(e.cod) || 0) + (Number(e.bt) || 0) + (Number(e.cash) || 0);
          e.total = (Number(e.ac) || 0) + (Number(e.bonus) || 0) + (Number(e.cod) || 0) + (Number(e.instantBonus) || 0) + (Number(e.mc) || 0);
        });
        this.activationList = res.data;
      }
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