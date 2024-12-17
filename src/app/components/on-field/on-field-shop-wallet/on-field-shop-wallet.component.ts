import { Component, OnInit, Input } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  commissionAmount = 0.00;
  bonusAmount = 0.00;
  instantBonusAmount = 0.00;

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private onFieldService: OnFieldService,
  ) { }

  ngOnInit(): void {
    if (this.selectedShopId > 0) {
      this.loadData();
    }
  }

  loadData(): void {

    this.onFieldService.onFieildCommissionWalletAmounts(this.selectedShopId).subscribe((res) => {
      this.commissionAmount = res.data?.filter((f: any) => f.walletType == 'Commission')[0].amount;
      this.bonusAmount = res.data?.filter((f: any) => f.walletType == 'Bonus')[0].amount;
    });
  }

  ngOnChanges(): void {
    this.loadData();
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