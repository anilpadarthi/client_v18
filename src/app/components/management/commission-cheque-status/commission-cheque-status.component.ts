
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-commission-cheque-status',
  templateUrl: './commission-cheque-status.component.html',
  styleUrl: './commission-cheque-status.component.scss'
})


export class CommissionChequeStatusComponent implements OnInit {

  displayedColumns: string[] = [
    'ShopId',
    'ShopName',
    'PostCode',
    'ChequeNumber',
    'TotalAmount',
    'CommissionDate',
    'Status',
    'PaidDate'
  ];
  chequeList: any[] = [];
  searchText!: string | null;


  constructor
    (
      private router: Router,
      private toasterService: ToasterService,
      private reportService: ReportService
    ) { }

  ngOnInit(): void {
  }



  loadData(): void {
    this.reportService.getBankChequeStatus(this.searchText).subscribe((res) => {
      this.chequeList = res.data;
    });
  }


  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.searchText = null;
    this.chequeList = [];
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

}
