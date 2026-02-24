import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OnFieldShopWalletHistoryComponent } from '../on-field-shop-wallet-history/on-field-shop-wallet-history.component';


@Component({
  selector: 'app-on-field-shop-wallet',
  templateUrl: './on-field-shop-wallet.component.html',
  styleUrl: './on-field-shop-wallet.component.scss'
})

export class OnFieldShopWalletComponent implements OnInit {

  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  commissionAmount = 0.00;
  bonusAmount = 0.00;
  instantBonusAmount = 0.00;
  isDisplayInstantBonus = false;
  hasViewWalletHistory = false;
  private isFirstChange = true;
  isLoading = false;

  constructor(
    public datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    private onFieldService: OnFieldService,
    private webstorgeService: WebstorgeService,
  ) { }

  ngOnInit(): void {
    if (this.selectedShopId > 0) {
      this.loadData();
    }
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin' || userRole == 'Manager') {
      this.isDisplayInstantBonus = true;
     
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.onFieldService.onFieildCommissionWalletAmounts(this.selectedShopId).subscribe((res) => {
      this.isLoading = false;
      if (res.data != null) {
        this.commissionAmount = res.data?.outstandingCommissionAmount;
        this.bonusAmount = res.data?.outstandingBonusAmount;
        this.instantBonusAmount = res.data?.outstandingInstantBonusAmount;
      }
      else {
        this.commissionAmount = 0;
        this.bonusAmount = 0;
        this.instantBonusAmount = 0;
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


  openShopWalletHistoryDialog(walletType: string): void {
  
      const data = {
        shopId: this.selectedShopId,
        walletType: walletType,
      };
      const dialogRef = this.dialog.open(OnFieldShopWalletHistoryComponent, {
        data
      });
    
  }

  openShoppingPage(type: any): void {

    const fullPath = this.router.serializeUrl(
      this.router.createUrlTree([`accessories/create-order/${this.selectedShopId}/${type}`])
    );
    window.open(fullPath, '_blank');
  }

}