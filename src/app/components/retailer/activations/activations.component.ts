import { Component, OnInit } from '@angular/core';
import { RetailerService } from '../../../services/retailer.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activations',
  templateUrl: './activations.component.html',
  styleUrl: './activations.component.scss'
})

export class ActivationsComponent implements OnInit {

  selectedMonth: string | null = null;
  totalCount = 0;
  resultList: any = [];
  displayedColumns: string[] = [
    'Date',
    'Network',
    'Activations',    
  ];

  constructor(
    public datePipe: DatePipe,
    private retailerService: RetailerService,
  ) { }

  ngOnInit(): void {   
  }

   get totalActivated(): number {
    return this.resultList.reduce((sum: any, item: any) => sum + item.activated, 0);
  }

  loadData(): void {
    const requestBody = {
      fromDate: this.selectedMonth
    };

    this.retailerService.getActivations(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.resultList = res.data;
      }
      else {
        this.resultList = null;
      }
    });
  }


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
  }
}