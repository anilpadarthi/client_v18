
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RetailerService } from '../../../services/retailer.service';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../../services/web-storage.service';

@Component({
  selector: 'app-given-vs-activations',
  templateUrl: './given-vs-activations.component.html',
  styleUrl: './given-vs-activations.component.scss'
})

export class GivenVsActivationsComponent implements OnInit {

  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  private isFirstChange = true;
  searchText: any;
  isLoading = false;

  givenList: any = [];
  activationList: any = [];
  mergedDataSource: any = [];
  mergedRow:any;
  dynamicColumns: string[] = [];


  constructor(
    public datePipe: DatePipe,
    private retailerService: RetailerService,
    private webstorgeService: WebstorgeService
  ) { }


  ngOnInit(): void {
    this.selectedShopId = this.webstorgeService.getUserInfo().userId;
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const request = {
      shopId: this.selectedShopId,
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 12)),
      toDate: new Date(),
      activationType: 'D',
    };
    
    this.retailerService.getStockVsConnections(request).subscribe((res) => {
      this.isLoading = false;
      if (res.data?.length > 0) {
        const result = res.data;
        this.givenList = result[0];
        this.activationList = result[1];
        if (this.givenList.length > 0) {
          this.mergedDataSource = this.givenList.map((givenRow: any, index: any) => {
            const activatedRow = this.activationList[index];
            this.mergedRow = { MonthName: givenRow.MonthName };
            let rowTotalGiven = 0;
            let rowTotalActivated = 0;

            // Merge "Given" and "Activated" columns for each network
            Object.keys(givenRow).forEach((key) => {
              if (key !== 'MonthName' && key !== 'LYCA') {
                this.mergedRow[`${key}_Given`] = givenRow[key] ?? 0;
                this.mergedRow[`${key}_Activated`] = activatedRow[key] ?? 0;
                rowTotalGiven += givenRow[key] ?? 0;
                rowTotalActivated += activatedRow[key] ?? 0;
              }
            });
            this.mergedRow['TotalGiven'] = rowTotalGiven;
            this.mergedRow['TotalActivated'] = rowTotalActivated;
            this.dynamicColumns = Object.keys(this.mergedRow);
            return this.mergedRow;
          });          
        }
      }
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false; // Mark first change as handled
      return; // Skip logic on the first change detection pass
    }

    if (changes['selectedShopId'] || changes['refreshValue']) {
      this.loadData();
    }
  }


}