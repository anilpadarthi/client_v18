import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrl: './retailer.component.scss'
})

export class RetailerComponent implements OnInit {

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
  ) { }

  ngOnInit(): void {   
  }

   

  
}