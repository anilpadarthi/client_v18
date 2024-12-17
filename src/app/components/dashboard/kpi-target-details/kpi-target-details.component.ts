import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-kpi-target-details',
  templateUrl: './kpi-target-details.component.html',
  styleUrl: './kpi-target-details.component.scss'
})

export class KpiTargetDetailsComponent implements OnInit {
  @Input() selectedDate: any
  searchText: any;
  displayedColumns: string[] = [
    'ID',
    'Name',
    'PreviousActivations',
    'CurrentActivations',
    'InstantActivations',
    'Total'
  ];
  activations = [
    {
      network: 'EE',
      previousActivations: '2',
      currentActivations: '3',
      lastActivated: '2024-01-01',
      total: '24'
    }
  ];
  dataSource: any = null;


  constructor(public datePipe: DatePipe) { }


  ngOnInit(): void {
    this.dataSource = this.activations;
  }



}
