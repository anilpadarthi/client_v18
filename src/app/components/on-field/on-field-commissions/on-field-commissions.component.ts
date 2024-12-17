import { Component, OnInit,Input } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-commissions',
  templateUrl: './on-field-commissions.component.html',
  styleUrl: './on-field-commissions.component.scss'
})


export class OnFieldCommissionsComponent implements OnInit {
  @Input() selectedShopId!: number; 
  activationList: any = [];
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
    'TOTAL',
    'CommissionAmount',
    'BonusAmount'
  ];
  
  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService,
  ) {}

  ngOnInit(): void {
    if(this.selectedShopId > 0){
      this.loadData();
    }
  }


  loadData(): void {   
    const request = {
      shopId: this.selectedShopId,
      activationType : 'D',
    };
    this.onFieldService.onFieldCommissionList(request).subscribe((res) => {
      this.activationList = res.data;
    });
  }
  

  ngOnChanges(): void {
    this.loadData();
  }

  
}