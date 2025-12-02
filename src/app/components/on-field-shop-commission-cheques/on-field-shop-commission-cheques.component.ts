import { Component, OnInit, Input, Inject } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-shop-commission-cheques',
  templateUrl: './on-field-shop-commission-cheques.component.html',
  styleUrl: './on-field-shop-commission-cheques.component.scss'
})
export class OnFieldShopCommissionChequesComponent implements OnInit {


  displayedColumns: string[] = [
    'CommissionDate',
    'ChequeNumber',
    'Amount',
    'Status',
    'PaidDate',
  ];
  commissionChequeList: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<OnFieldShopCommissionChequesComponent>,
    private _onShopService: ShopService,
  ) { }


  ngOnInit(): void {
    if (this._data.shopId > 0) {
      this.loadData();
    }
  }

  loadData(): void {
    this._onShopService.getShopCommissionCheques(this._data.shopId).subscribe((res) => {
      this.commissionChequeList = res.data;
    });
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}