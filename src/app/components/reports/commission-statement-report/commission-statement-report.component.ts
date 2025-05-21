import { Component, OnInit } from '@angular/core';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { WebstorgeService } from '../../../services/web-storage.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';


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
  fromMonth: string | null = null;
  toMonth: string | null = null;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  commissionList: any = [];
  isLoading = false;
  userRole = '';
  isAdmin = false;
   areaFilterCtrl: FormControl = new FormControl();
  shopFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];
  filteredShops: any[] = [];
   userFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];

  displayedColumns: string[] = [
    'UserName',
    'AreaName',
    'ShopName',
    'CommissionDate',
    'CommissionAmount',
    'BonusAmount',
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

     this.areaFilterCtrl.valueChanges.subscribe(() => {
      this.filterAreas();
    });
    this.shopFilterCtrl.valueChanges.subscribe(() => {
      this.filterShops();
    });
     this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });

  }

   private filterAreas() {
    const search = this.areaFilterCtrl.value?.toLowerCase() || '';
    this.filteredAreas = this.areaLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterShops() {
    const search = this.shopFilterCtrl.value?.toLowerCase() || '';
    this.filteredShops = this.shopLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }
  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
      this.filteredAreas = res.data;
    });
  }

  areaChange() {
    this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
      this.shopLookup = res.data;
      this.filteredShops = res.data;
    });
  }

  loadData(): void {
    this.isLoading = true;
    const requestBody = {
      fromDate: this.fromMonth,
      toDate: this.toMonth,
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
    this.fromMonth = null;
    this.toMonth = null;
    this.selectedUserId = null;
    this.isOptedIn = false;
    this.commissionList = [];
  }


  onAccessoreisPage(shopCommissionHistoryId: number): void {
    const fullPath = this.router.serializeUrl(
      this.router.createUrlTree([`accessories/create-order/${shopCommissionHistoryId}/MC`])
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
      isOptedForCheques: this.isOptedIn,
      fromDate: this.fromMonth

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
    this.commissionStatementService.exportCommissionChequeExcel(this.isOptedIn, this.fromMonth);
  }

  // Handle Year Selection (no action needed)
    chosenYearHandler(normalizedYear: any) {
      // No action required, just wait for month selection
    }
  
    // Handle Month Selection
    choseFromMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
      const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
      this.fromMonth = formattedMonth + "-01";
      datepicker.close(); // Close picker after selection
      return formattedMonth + "-01";
    }
  
    choseToMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
      const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
      this.toMonth = formattedMonth + "-01";
      datepicker.close(); // Close picker after selection
    }

}