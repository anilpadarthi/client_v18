import { Component } from '@angular/core';
import { SimService } from '../../../services/sim.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-imei-search',
  templateUrl: './imei-search.component.html',
  styleUrl: './imei-search.component.scss'
})

export class ImeiSearchComponent {
  searchText: any;
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
    private toasterService: ToasterService
  ) { }

  onSearch(): void {
    const request = {
      imeiNumbers: this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null
    };

    this.simService.getSimHistoryDetails(request).subscribe((res) => {
      if (res.data.length > 0) {
        this.displayedColumns = Object.keys(res.data[0]);
        this.dataSource = res.data;
      }
      else {
        this.dataSource = [];
      }
    });

  }

  onDeallocate(): void {
    const request = {
      imeiNumbers: this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null,
      shopId:0
    };

    this.simService.deAllocateSims(request).subscribe((res) => {
      this.toasterService.showMessage(res.data);
      if (res.data.length > 0) {
        this.displayedColumns = Object.keys(res.data[0]);
        this.dataSource = res.data;
      }
      else {
        this.dataSource = [];
      }
    });

  }

  onClear(): void {
    this.dataSource = null;
    this.searchText = null;
  }

}
