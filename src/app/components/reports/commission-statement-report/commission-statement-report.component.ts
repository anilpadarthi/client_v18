import { Component, OnInit } from '@angular/core';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { WebstorgeService } from '../../../services/web-storage.service';



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
  isLoading = false;
  userRole = '';
  isAdmin = false;
  displayedColumns: string[] = [
    'UserName',
    'AreaName',
    'ShopName',
    'CommissionDate',
    'CommissionAmount',
    'BonusAmount',
    'OptedCheque',
    'OptedTopup',
    'OptedWallet',
    // 'Accessories',
    'Action'
  ];

  constructor(
    private datePipe: DatePipe,
    private commissionStatementService: CommissionStatementService,
    private webstorgeService: WebstorgeService,
    private lookupService: LookupService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin') {
      this.isAdmin = true;
    }
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
    this.isLoading = true;
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
      this.isLoading = false;
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
    if (selectedDate) {
      this.fromDate = `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
    }
  }

  onAccessoreisPage(shopCommissionHistoryId: number): void {
    const fullPath = this.router.serializeUrl(
      this.router.createUrlTree([`aceessories/create-order/${shopCommissionHistoryId}/MC`])
    );
    window.open(fullPath, '_blank');
  }

  optedForCheque(shopCommissionHistoryId: number, isChecked: boolean): void {
    if (isChecked) {
      this.commissionStatementService.optInForShopCommission(shopCommissionHistoryId, 'Cheque').subscribe((res) => {
        if (res.statusCode == 200) {
          this.loadData();
          this.toasterService.showMessage("Successfully opted.");
        }
        else {
          this.toasterService.showMessage(res.data);
        }
      });
    }
  }

  optedForTopup(shopCommissionHistoryId: number, isChecked: boolean): void {
    if (isChecked) {
      this.commissionStatementService.optInForShopCommission(shopCommissionHistoryId, 'Topup').subscribe((res) => {
        if (res.statusCode == 200) {
          this.loadData();
          this.toasterService.showMessage("Successfully opted.");
        }
        else {
          this.toasterService.showMessage(res.data);
        }
      });
    }
  }

  optedForWallet(shopCommissionHistoryId: number, isChecked: boolean): void {
    if (isChecked) {
      this.commissionStatementService.optInForShopCommission(shopCommissionHistoryId, 'Wallet').subscribe((res) => {
        if (res.statusCode == 200) {
          this.loadData();
          this.toasterService.showMessage("Successfully opted.");
        }
        else {
          this.toasterService.showMessage(res.data);
        }
      });
    }
  }

  downloadCommissionStatement(shopId: number, fromDate: string): void {
    this.commissionStatementService.downloadCommissionStatement(shopId, fromDate);
  }

  exportToPDF(mode: any): void {
    let requestBody = {


    }
    this.toasterService.showMessage("Downloading...");
    this.commissionStatementService.getCommissionStatementReport(requestBody).subscribe((res) => {
      if (res) {
        this.toasterService.showMessage("Successfully downloaded.");
      }
    });
  }

  exportToExcel(): void {    
    this.toasterService.showMessage("Downloading...");
    this.commissionStatementService.exportToExcel(this.isOptedIn,this.fromDate);
  }

}