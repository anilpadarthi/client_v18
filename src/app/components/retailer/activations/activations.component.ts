import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RetailerService } from '../../../services/retailer.service';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../../services/web-storage.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-activations',
  templateUrl: './activations.component.html',
  styleUrl: './activations.component.scss'
})

export class ActivationsComponent implements OnInit {

  @Input() selectedShopId!: number;
  private isFirstChange = true;
  selectedMonth: string | null = null;
  totalCount = 0;
  resultList: any[] = [];
  groupedList: any[] = [];
  displayedColumns: string[] = [
    'Network',
    'Activations',
    'Action'
  ];

  constructor(
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private retailerService: RetailerService,
    private webstorgeService: WebstorgeService
  ) { }

  ngOnInit(): void {
  }

  get totalActivated(): number {
    return this.groupedList.reduce((sum: any, item: any) => sum + item.activationCount, 0);
  }

  loadData(): void {
    let loggedInUserId = this.selectedShopId || this.webstorgeService.getUserInfo().userId;
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: loggedInUserId
    };

    this.retailerService.getActivations(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.resultList = res.data;
        const groupedResult = Object.values(
          res.data.reduce((acc: any, item: any) => {
            if (!acc[item.network]) {
              acc[item.network] = { network: item.network, activationCount: 0 };
            }
            acc[item.network].activationCount++;
            return acc;
          }, {} as Record<string, { network: string; activationCount: number }>)
        );
        this.groupedList = groupedResult;
      }
      else {
        this.groupedList = [];
      }
    });
  }

  loadDetails(network: any): void {
    var detailList = this.resultList.filter((f: any) => f.network == network);
    var data = {
      result: detailList,
      headerName: network
    }

    this.dialog.open(PopupTableComponent, {
      data
    });
  }


  onFilter(): void {
    this.loadData();
  }

  onClear(): void {
    this.selectedMonth = null;
    this.groupedList = [];
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