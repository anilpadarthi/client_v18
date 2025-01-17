import { Component, OnInit } from '@angular/core';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { LookupService } from '../../../services/lookup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-commission-statement-report',
  templateUrl: './commission-statement-report.component.html',
  styleUrl: './commission-statement-report.component.scss'
})


export class CommissionStatementReportComponent implements OnInit {

  selectedAreaId = null;
  selectedShopId = null;
  selectedUserId = null;
  isOptedIn = false;
  totalCount = 0;
  fromDate: any = null;
  toDate: any = null;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  commissionList: any = [];
  displayedColumns: string[] = [
    'UserName',
    'AreaName',
    'ShopId',
    'ShopName',
    'PostCode',
    'CommissionDate',
    'CommissionAmount',
    'BonusAmount',
    'Action'
  ];

  constructor(
    private datePipe: DatePipe,
    private commissionStatementService: CommissionStatementService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void { 
    this.getAreaLookup();
    this.getAgentLookup();

  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
    });
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
    });
  }

  areaChange() {
    this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
      this.shopLookup = res.data;
    });
  }

  loadData(): void {

    const requestBody = {
      fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      areaId: this.selectedAreaId,
      shopId: this.selectedShopId,
      userId: this.selectedUserId,
    };

    this.commissionStatementService.getCommissionList(requestBody).subscribe((res) => {
      
      if (res.data.length > 0) {        
        this.commissionList = res.data;
      }
    });

  }


  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.selectedAreaId = null;
    this.selectedShopId = null;
    this.fromDate = null;
    this.toDate = null;
    this.selectedUserId = null;
    this.isOptedIn = false;
    this.commissionList = [];
  }

  onDateChange(event: any): void {
    const selectedDate = event.value;
    console.log(selectedDate);
    if (selectedDate) {
      this.fromDate = `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
    }
  }


}