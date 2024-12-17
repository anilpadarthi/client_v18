import { Component, OnInit, Input } from '@angular/core';
import { SimService } from '../../../services/sim.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-on-field-scan-sims',
  templateUrl: './on-field-scan-sims.component.html',
  styleUrl: './on-field-scan-sims.component.scss'
})

export class OnFieldScanSimsComponent {
  searchText: any;
  @Input() selectedShopId!: number
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
  ) { }

  onScanSims(): void {
    if (this.searchText) {
      const request = {
        imeiNumbers: this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null,
        shopId: this.selectedShopId
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
    else {
      this.toasterService.showMessage('Please enter IMEI / PCNNO and scan before proceed to furthur.');
    }
  }

  onAllocateSims(): void {

    if (this.dataSource?.length > 0) {
      const request = {
        imeiNumbers: this.dataSource.filter((f: any) => f.status == 'NotAssigned').map((m: any) => m.imei),
        shopId: this.selectedShopId
      };

      if (request.imeiNumbers.length > 0) {
        this.simService.allocateSims(request).subscribe((res) => {
          if (res.data.length > 0) {
            this.dataSource = null;
            this.toasterService.showMessage(res.data);
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

  ngOnChanges(): void {

  }
}