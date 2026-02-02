import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../../services/web-storage.service';
import { ToasterService } from '../../../services/toaster.service';
import { CommissionStatementService } from '../../../services/commissionStatement.service';


@Component({
  selector: 'app-on-field-commissions',
  templateUrl: './on-field-commissions.component.html',
  styleUrl: './on-field-commissions.component.scss'
})


export class OnFieldCommissionsComponent implements OnInit {
  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  @Input() selectedYear!: number;
  fromDate: any;
  toDate: any;
  private isFirstChange = true;
  isLoading = false;
  activationList: any = [];
  userRole = '';
  isAdmin = false;
  displayedColumns: string[] = [
    'DATE',
    'ChequeNumber',
    'OptInType',
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
    //'BonusAmount',
    'actions'
  ];

  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService,
    private webstorgeService: WebstorgeService,
    private toasterService: ToasterService,
    private commissionStatementService: CommissionStatementService
  ) { }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }
    if (this.selectedShopId > 0) {
      this.loadData();
    }
  }


  loadData(): void {
    this.isLoading = true;
     const dates = this.getReportDates();
    const request = {
      shopId: this.selectedShopId,
      isInstantActivation: false,
      fromDate: dates.fromDate,
      toDate: dates.toDate
    };
    this.onFieldService.onFieldCommissionList(request).subscribe((res) => {
      this.isLoading = false;
      if (res.data) {
        let result = res.data;
        if (!this.isAdmin) {
          result = result.filter((r: any) => r.commissionAmount > 12);
        }
        result.forEach((e: any) => {
          e.total = e.ee + e.three + e.o2 + e.giffgaff + e.lebara + e.vodafone + e.voxi + e.smarty;
        });
        this.activationList = result;
      }
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false; // Mark first change as handled
      return; // Skip logic on the first change detection pass
    }

    if (changes['selectedShopId'] || changes['refreshValue']) {
      this.loadData();
    }
  }

  hideBonus(shopCommissionHistoryId: number, includeWalletBonus: any): void {
    this.commissionStatementService.hideBonus(shopCommissionHistoryId, !includeWalletBonus).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage("Successfully hidden.");
      }
      else {
        this.toasterService.showMessage(res.data);
      }
    });
  }

  downloadCommissionStatement(shopId: number, fromDate: string): void {
    this.commissionStatementService.downloadCommissionStatement(shopId, fromDate);
  }

  private getReportDates(months: number = 8) {
    let fromDate: string | null = null;
    let toDate: string | null = null;
    if (this.selectedYear == null || this.selectedYear === 0) {
      // Last 6 months logic
      const currentDate = new Date();

      const fDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - months,
        1
      );

      const tDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );


      fromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
      toDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');

    } else {
      // Selected year logic
      const year = this.selectedYear;

      const fDate = new Date(year, 0, 1);
      const tDate = new Date(year, 11, 1);

      fromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
      toDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');
    }
    return { fromDate, toDate };
  }

 


}