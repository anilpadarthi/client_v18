import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SimService } from '../../../services/sim.service';
import { ToasterService } from '../../../services/toaster.service';
import { ShopService } from '../../../services/shop.service';
import { PostcodeService } from '../../../services/postcode.service';


@Component({
  selector: 'app-on-field-scan-sims',
  templateUrl: './on-field-scan-sims.component.html',
  styleUrl: './on-field-scan-sims.component.scss'
})

export class OnFieldScanSimsComponent {
  searchText: any;
  selectedShopId!: number;
  @Input() refreshValue!: number;
  @Input() geoLocation!: any;
  @Output() notifyParent = new EventEmitter<string>();
  @Input() shopAddressDetails: any = null;
  isLebaraSims = false;
  displayedColumns: string[] = [
    'SIMID',
    'NETWORK',
    'IMEI',
    'PCNNO',
    'STATUS'
  ];
  dataSource: any = null;

  constructor(
    private simService: SimService,
    private toasterService: ToasterService,
    private shopService: ShopService,
    private postcodeService: PostcodeService,
  ) {
    this.selectedShopId = this.shopAddressDetails?.shopId;
  }

  onScanSims(): void {
    if (this.searchText) {
      if (this.selectedShopId) {
        this.postcodeService.getDistanceBetweenLatAndLong(this.geoLocation.latitude, this.geoLocation.longitude,
          this.shopAddressDetails.latitude, this.shopAddressDetails.longitude).subscribe((res) => {
            if (res.metres < 300) {
              this.proceedToScanSims();
            }
            else {
              this.toasterService.showMessage('You are not allowd to scan sims for this shop, for this location.')
            }
          });
      }
    }
    else {
      this.toasterService.showMessage('Please enter IMEI / PCNNO and scan before proceed to furthur.');
    }
  }

  proceedToScanSims(): void {
    const imeiList = this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null;
    let isValidSims = true;
    if (this.isLebaraSims) {
      isValidSims = this.validateLebaraSims();
    }
    if (isValidSims) {
      const request = {
        imeiNumbers: imeiList,
        moblieNumbers: imeiList,
        shopId: this.selectedShopId,
      };

      this.simService.scanSims(request).subscribe((res) => {
        if (res.data.length > 0) {
          this.dataSource = res.data;
        }
        else {
          this.dataSource = [];
        }
      });
    }
  }

  onAllocateSims(): void {

    if (this.dataSource?.length > 0) {
      const request = {
        imeiNumbers: this.dataSource.filter((f: any) => f.status == 'NotAssigned').map((m: any) => m.imei),
        shopId: this.selectedShopId,
        latitude: String(this.geoLocation.latitude),
        longitude: String(this.geoLocation.longitude),
      };

      if (request.imeiNumbers.length > 0) {
        this.simService.allocateSims(request).subscribe((res) => {
          if (res.data?.length > 0) {
            this.dataSource = null;
            this.toasterService.showMessage(res.data);
            this.notifyParent.emit();
          }
          else {
            this.toasterService.showMessage('Something went wrong.');
          }
        });
      }
      else {
        this.toasterService.showMessage('Only un-assigned sims can be assigned, please have a look');
      }
    }
    else {
      this.toasterService.showMessage('Please scan the sims before proceed to furthur.');
    }
  }

  onDeAllocateSims(): void {
    if (this.dataSource?.length > 0) {
      const request = {
        imeiNumbers: this.dataSource.filter((f: any) => f.status != 'Invalid').map((m: any) => m.imei),
        shopId: this.selectedShopId
      };

      this.simService.deAllocateSims(request).subscribe((res) => {
        if (res.data.length > 0) {
          this.dataSource = null;
          this.toasterService.showMessage(res.data);
        }
      });
    }
    else {
      this.toasterService.showMessage('Please scan the sims before proceed to furthur.');
    }
  }

  onClear(): void {
    this.dataSource = null;
    this.searchText = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shopAddressDetails'] || changes['refreshValue']) {
      this.selectedShopId = this.shopAddressDetails.shopId;
    }
  }

  validateLebaraSims(): boolean {
    debugger;
    const pcnNoList = this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null;
    if (pcnNoList != null) {
      for (var i = 0; i < pcnNoList.length; i++) {
        if (pcnNoList[i] != "") {
          if (pcnNoList[i + 1] == undefined || pcnNoList[i + 1].length != 11) {
            this.toasterService.showMessage("Please enter valid PHONE number for LEBARA");
            return false;
          }
          else if (!pcnNoList[i].startsWith("8944100030")) {
            this.toasterService.showMessage("Please enter valid ICICD number for LEBARA");
            return false;
          }
         
        }
        i = i + 1;
      }
    }
    return true;
  }

}