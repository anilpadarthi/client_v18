import { Component, OnInit, Input } from '@angular/core';
import { LookupService } from '../../services/lookup.service';
import { ShopService } from '../../services/shop.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PopupTableComponent } from '../common/popup-table/popup-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-on-field',
  templateUrl: './on-field.component.html',
  styleUrl: './on-field.component.scss'
})

export class OnFieldComponent implements OnInit {


  selectedAreaId: any = null;
  selectedShopId: any = null;
  areaLookup: any = [];
  shopLookup: any = [];
  action = '';
  isMainSection = true;

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private lookupService: LookupService,
    private shopService: ShopService,
    private toasterService: ToasterService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getAreaLookup();

  }

  ngOnChanges() {

  }

  onSubmit() {
    if (this.selectedShopId == null) {
      this.toasterService.showMessage('Please select any shop before to proceed.');
    }
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
    });
  }

  areaChange() {
    this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
      this.shopLookup = res.data;
      this.selectedShopId = null;
    });
  }

  openShopVisitHistoryDialog(): void {
    this.shopService.getShopVisitHistory(this.selectedShopId).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: 'Shop Visit History'
      }
      this.dialog.open(PopupTableComponent, {
        data
      });
    });
  }

  openShopAgreementHistoryDialog(): void {
    this.toasterService.showMessage("Comming soon...");

    // this.shopService.getShopVisitHistory(this.selectedShopId).subscribe((res) => {
    //   var data = {
    //     result: res.data,
    //     headerName: 'Agreement History'
    //   }
    //   this.dialog.open(PopupTableComponent, {
    //     data
    //   });
    // });
  }

  onActionClicked(type: any) {
    this.action = type;
    this.isMainSection = false;
  }

  displayMainSection(): void {
    this.isMainSection = true;
  }

  openShoppingPage(): void{
    const fullPath = this.router.serializeUrl(
      this.router.createUrlTree([`aceessories/create-order/${ this.selectedShopId }`])
    );
    window.open(fullPath, '_blank');
  }

}