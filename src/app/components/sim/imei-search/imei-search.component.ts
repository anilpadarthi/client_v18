import { Component } from '@angular/core';
import { SimService } from '../../../services/sim.service';


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

  onClear(): void {
    this.dataSource = null;
    this.searchText = null;
  }

}
