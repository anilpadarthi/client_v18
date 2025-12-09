import { Component } from '@angular/core';
import { SimService } from '../../../services/sim.service';
import { ToasterService } from '../../../services/toaster.service';
import { WebstorgeService } from '../../../services/web-storage.service';

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
  userRole: string | null = null;


  constructor(
    private simService: SimService,
    private toasterService: ToasterService,
    private webstorgeService: WebstorgeService
  ) {

    this.userRole = this.webstorgeService.getUserRole();
  }

  onSearch(): void {
    const request = {
      imeiNumbers: this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null
    };

    this.simService.getSimHistoryDetails(request).subscribe((res) => {
      if (res.data.length > 0) {
        let columns = Object.keys(res.data[0]);
        if (this.userRole === 'Admin' || this.userRole === 'SuperAdmin') {
          this.displayedColumns = columns;
        }
        else {
          columns = columns.filter(c => c.toLowerCase() !== 'supplier' && c.toLowerCase() !== 'lotno');
          this.displayedColumns = columns;
        }

        this.dataSource = res.data;
      }
      else {
        this.dataSource = [];
      }
    });

  }

  onDeallocate(): void {
    if (this.searchText == null || this.searchText.trim() == '') {
      this.toasterService.showMessage('Please enter IMEI numbers to de-allocate SIMs.');
      return;
    }

    const request = {
      imeiNumbers: this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null,
      shopId: 0
    };

    this.simService.deAllocateSims(request).subscribe((res) => {
      if (res.statusCode == 200) {
        this.toasterService.showMessage(res.data);
      }
      else {
        this.toasterService.showMessage(res.message);
      }

    });

  }

  onClear(): void {
    this.dataSource = null;
    this.searchText = null;
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

}
