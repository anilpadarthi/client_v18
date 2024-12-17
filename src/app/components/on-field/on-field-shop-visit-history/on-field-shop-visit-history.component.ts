import { Component, OnInit,Input } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { OnFieldService } from '../../../services/on-field.service';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-shop-visit-history',
  templateUrl: './on-field-shop-visit-history.component.html'
})

export class OnFieldShopVisitHistoryComponent implements OnInit {
  searchText: any;
  displayedColumns: string[] = [
    'DATE',
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFGAFF',
    'VODAFONE',
    'VOXI',    
    'SMARTY',
    'TOTAL'
  ];
  dataSource : any =null;
  @Input() selectedShopId!: number; 

  constructor(
    public datePipe: DatePipe,
  ) {}

  
  ngOnInit(): void {
    this.dataSource = [];
  }
  
  closeDialog(): void {
    
  }
  
}
