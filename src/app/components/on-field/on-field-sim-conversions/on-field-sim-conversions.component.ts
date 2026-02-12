import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-on-field-sim-conversions',
  templateUrl: './on-field-sim-conversions.component.html',
  styleUrl: './on-field-sim-conversions.component.scss'
})

export class OnFieldSimConversionsComponent implements OnInit {
  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  @Input() selectedYear!: number;
  fromDate: any;
  toDate: any;
  private isFirstChange = true;
  searchText: any;
  isLoading = false;

  givenList: any = [];
  activationList: any = [];
  mergedDataSource: any = [];
  mergedRow: any;
  dynamicColumns: string[] = [];


  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService
  ) { }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    const dates = this.getReportDates();
    const request = {
      shopId: this.selectedShopId,
      activationType: 'D',
      fromDate: dates.fromDate,
      toDate: dates.toDate
    };

    this.givenList = [];
    this.activationList = [];
    this.mergedDataSource = [];

    this.onFieldService.onFieldSimConversionList(request).subscribe((res) => {
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


  private getReportDates(months: number = 6) {
    let fromDate: string | null = null;
    let toDate: string | null = null;
    if (this.selectedYear == null || this.selectedYear === 0) {
      // Last 6 months logic
      const currentDate = new Date();

      const fDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - months,
        1
      );

      const tDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );


      fromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
      toDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');

    } else {
      // Selected year logic
      const year = this.selectedYear;

      const fDate = new Date(year, 0, 1);
      const tDate = new Date(year, 11, 1);

      fromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
      toDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');
    }
    return { fromDate, toDate };
  }

}