import { Component, OnInit, Input, Inject } from '@angular/core';
import { PaginatorConstants } from '../../../helpers/paginator-constants';
import { OnFieldService } from '../../../services/on-field.service';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-shop-wallet-history',
  templateUrl: './on-field-shop-wallet-history.component.html',
  styleUrl: './on-field-shop-wallet-history.component.scss'
})

export class OnFieldShopWalletHistoryComponent implements OnInit {


  displayedColumns: string[] = [
    'TRANSACTIONDATE',
    'DESCRIPTION',
    'REFERENCENUMBER',
    'TRANSACTIONTYPE',
    'CREDIT',
    'DEBIT',
    'BALANCE',
  ];
  walletHistoryList: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<OnFieldShopWalletHistoryComponent>,
    private onFieldService: OnFieldService,
  ) { }


  ngOnInit(): void {
    if (this._data.shopId > 0) {
      this.loadData();
    }
  }

  loadData(): void {
    this.onFieldService.onFieldCommissionWalletHistory(this._data).subscribe((res) => {
      this.walletHistoryList = res.data;
    });
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}