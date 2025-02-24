import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { WebstorgeService } from '../../../services/web-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
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
  private isFirstChange = true;
  isLoading = false;

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private onFieldService: OnFieldService,
    private webstorgeService: WebstorgeService,
  ) { }

  ngOnInit(): void {
    if (this.selectedShopId > 0) {
      this.loadData();
    }
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.isDisplayInstantBonus = true;
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.onFieldService.onFieildCommissionWalletAmounts(this.selectedShopId).subscribe((res) => {
      this.isLoading = false;
      if (res.data.length > 0) {
        this.commissionAmount = res.data?.filter((f: any) => f.walletType == 'Commission')[0].amount;
        this.bonusAmount = res.data?.filter((f: any) => f.walletType == 'Bonus')[0].amount;
        let instantBonusAmt = res.data?.filter((f: any) => f.walletType == 'InstantBonus');
        this.instantBonusAmount = instantBonusAmt != null && instantBonusAmt.length > 0 ? instantBonusAmt[0].amount : 0.00;
      }
      else{
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

    if (changes['selectedShopId'] || changes['refreshValue']  ) {
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

}