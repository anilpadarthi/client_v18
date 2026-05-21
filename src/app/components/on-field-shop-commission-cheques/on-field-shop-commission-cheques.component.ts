import { Component, OnInit, Input, Inject } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../services/web-storage.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-on-field-shop-commission-cheques',
  templateUrl: './on-field-shop-commission-cheques.component.html',
  styleUrl: './on-field-shop-commission-cheques.component.scss'
})
export class OnFieldShopCommissionChequesComponent implements OnInit {


  displayedColumns: string[] = [
    'CommissionMonth',
    'ChequeNumber',
    'OrderId',
    'Amount',
    'PaidOutDate',
    'Actions'
  ];
  commissionChequeList: any = [];
  editingRow: any = null;
  originalChequeNumber: string = '';
  canEditChequeNumber: boolean = false;
  isAddingNewCheque: boolean = false;

 
  chequeNumber: string = '';
  selectedMonth: string = '';
  amount:string = '';
  errorMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<OnFieldShopCommissionChequesComponent>,
    private _onShopService: ShopService,
    private webstorgeService: WebstorgeService
  ) { }


  ngOnInit(): void {
    let userRole = this.webstorgeService.getUserRole();
    if (userRole == 'Admin' || userRole == 'SuperAdmin') {
      this.canEditChequeNumber = true;
    }
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

  editCheque(element: any): void {
    this.editingRow = element;
    this.originalChequeNumber = element.chequeNumber;
  }

  saveCheque(element: any): void {
    if (element.chequeNumber !== this.originalChequeNumber) {
      this._onShopService.updateShopCommissionCheque(element.sno, element.chequeNumber).subscribe((res) => {
        if (res.statusCode === 200) {
          this.editingRow = null;
          this.originalChequeNumber = '';
          // Optionally reload data or show success message
        }
      });
    } else {
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    if (this.editingRow) {
      this.editingRow.chequeNumber = this.originalChequeNumber;
    }
    this.editingRow = null;
    this.originalChequeNumber = '';
  }

  addNewCheque(): void {
    this.isAddingNewCheque = true;
    this.chequeNumber = '';
    this.selectedMonth = '';
  }

  saveNewCheque(): void {
    
    if (!this.chequeNumber || !this.selectedMonth || !this.amount) {
      this.errorMessage = 'Please enter all cheque details before saving.';
      return;
    }

    const payload = {
      shopId: this._data.shopId,
      chequeNumber: this.chequeNumber,
      commissionDate: this.selectedMonth,
      totalAmount: this.amount
    };

    this._onShopService.createShopCommissionCheque(payload).subscribe((res) => {
      if (res.statusCode === 200) {
        this.isAddingNewCheque = false;
        this.chequeNumber = '';
        this.selectedMonth = '';
        this.amount = '';
        this.loadData();
        // Optionally show success message
      }
      else {
        this.errorMessage = res.data;
      }
    }, (error) => {
      console.error('Error adding new cheque:', error);
      this.errorMessage = 'An error occurred while adding the cheque. Please try again.';
    });
  }

  cancelAddCheque(): void {
    this.isAddingNewCheque = false;
    this.chequeNumber = '';
    this.selectedMonth = '';
    this.amount = '';
  }

  // Handle Year Selection (no action needed)
  chosenYearHandler(normalizedYear: any) {
    // No action required, just wait for month selection
  }

  // Handle Month Selection
  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.selectedMonth = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
  }

}