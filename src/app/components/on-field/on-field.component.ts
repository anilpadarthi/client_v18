import { Component, OnInit, Input } from '@angular/core';
import { LookupService } from '../../services/lookup.service';
import { ShopService } from '../../services/shop.service';
import { ToasterService } from '../../services/toaster.service';
import { GeolocationService } from '../../services/geolocation.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PopupTableComponent } from '../common/popup-table/popup-table.component';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-on-field',
  templateUrl: './on-field.component.html',
  styleUrl: './on-field.component.scss'
})

export class OnFieldComponent implements OnInit {

  selectedAreaId: any = null;
  selectedShopId: any = null;
  shopAddressDetails: any = null;
  areaLookup: any = [];
  shopLookup: any = [];
  action = '';
  isMainSection = true;
  refreshCounter = 0;
  geoLocation: any;

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private lookupService: LookupService,
    private shopService: ShopService,
    private toasterService: ToasterService,
    private geolocationService: GeolocationService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getAreaLookup();
  }

  ngOnChanges() {
  }

  handleChildBackEvent(data: any): void {
    if (data) {
      this.shopAddressDetails = data;
    }
    this.displayMainSection();
  }

  onSubmit() {
    if (this.selectedShopId == null) {
      this.toasterService.showMessage('Please select any shop before to proceed.');
    }
    else {
      this.refreshCounter++;
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

  shopChange() {
    this.fetchLocation();
    this.getShopAddressDetails();
    this.displayMainSection();
  }

  fetchLocation(): void {
    if (environment.isGeoLocationTurnOn) {
      this.geolocationService.getCurrentLocation().then(
        (position) => {
          this.geoLocation = position;
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      this.geoLocation = {
        latitude: '17.17',
        longitude: '17.17'
      };
    }
  }

  openShopVisitHistoryDialog(): void {
    if (this.selectedShopId == null) {
      this.toasterService.showMessage('Please select any shop before to proceed.');
    }
    else {
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
  }

  openShopAgreementHistoryDialog(): void {
    if (this.selectedShopId == null) {
      this.toasterService.showMessage('Please select any shop before to proceed.');
    }
    else {
      this.shopService.getShopAgreementHistory(this.selectedShopId).subscribe((res) => {
        var data = {
          result: res.data,
          headerName: 'Agreement History'
        }
        this.dialog.open(PopupTableComponent, {
          data
        });
      });
    }
  }

  onActionClicked(type: any) {
    if (this.selectedShopId == null) {
      this.toasterService.showMessage('Please select any shop before to proceed.');
    }
    else {
      if (this.shopAddressDetails
        && this.shopAddressDetails?.latitude != null
        && this.shopAddressDetails.longitude != null
        && this.shopAddressDetails?.latitude != ''
        && this.shopAddressDetails.longitude != ''
      ) {
        this.action = type;
        this.isMainSection = false;
      }
      else {
        this.toasterService.showMessage('Shop details are missing, please fill to proceed furthur');
        this.action = 'EditShop';//open edit shop to update the details
        this.isMainSection = false;
      }
    }
  }

  displayMainSection(): void {
    this.isMainSection = true;
  }

  openShoppingPage(): void {
    if (this.selectedShopId == null) {
      this.toasterService.showMessage('Please select any shop before to proceed.');
    }
    else if (this.shopAddressDetails
      && this.shopAddressDetails?.latitude != null
      && this.shopAddressDetails.longitude != null
      && this.shopAddressDetails?.latitude != ''
      && this.shopAddressDetails.longitude != '') {
      const fullPath = this.router.serializeUrl(
        this.router.createUrlTree([`aceessories/create-order/${this.selectedShopId}/COD`])
      );
      window.open(fullPath, '_blank');
    }
    else {
      this.toasterService.showMessage('Shop details are missing, please fill to proceed furthur');
    }
  }

  refreshChildren() {
    this.refreshCounter++; // Increment to trigger change detection
  }

  getShopAddressDetails(): void {
    this.shopService.getShopAddressDetails(this.selectedShopId).subscribe((res) => {
      this.shopAddressDetails = res.data;
    });
  }

}