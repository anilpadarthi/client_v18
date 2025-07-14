
import { Component, OnInit } from '@angular/core';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-area-commissions',
  templateUrl: './area-commissions.component.html',
  styleUrl: './area-commissions.component.scss'
})

export class AreaCommissionsComponent implements OnInit {

  selectedAreaId = null;
  isOptedIn = false;
  totalCount = 0;
  fromMonth: string | null = null;
  areaLookup: any = [];
  commissionList: any = [];
  isLoading = false;
  isAdmin = false;
  areaFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];

  displayedColumns: string[] = [
    'UserName',
    'AreaName',
    'ShopName',
    'CommissionDate',
    'CommissionAmount',
    'TopupSystemId',
    // 'BonusAmount',
    'OptedCheque',
    // 'OptedTopup',
    'OptedWallet',
    'Accessories',
  ];

  constructor(
    private commissionStatementService: CommissionStatementService,
    private lookupService: LookupService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAreaLookup();
    this.areaFilterCtrl.valueChanges.subscribe(() => {
      this.filterAreas();
    });
  }

  private filterAreas() {
    const search = this.areaFilterCtrl.value?.toLowerCase() || '';
    this.filteredAreas = this.areaLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
      this.filteredAreas = res.data;
    });
  }


  loadData(): void {
    this.isLoading = true;
    const requestBody = {
      fromDate: this.fromMonth,
      areaId: this.selectedAreaId,
    };

    this.commissionStatementService.getAreaCommissionList(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.commissionList = res.data;
      }
      else {
        this.commissionList = [];
      }
      this.isLoading = false;
    });

  }


  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.selectedAreaId = null;
    this.fromMonth = null;
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

  optedForTopup(row: any, event: MatCheckboxChange): void {
    if (event.source.checked && row.topupSystemId != null && row.topupSystemId != '') {
      this.commissionStatementService.optInForShopCommission(row.shopCommissionHistoryId, 'Topup').subscribe((res) => {
        if (res.statusCode == 200) {
          this.loadData();
          this.toasterService.showMessage(res.data);
        }
        else {
          event.source.checked = false;
          this.toasterService.showMessage(res.data);
        }
      });
    }
    else {
      event.source.checked = false;
      this.toasterService.showMessage("Topup system id is not mapped, You can not do topup. Please reach out administrator");
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


}