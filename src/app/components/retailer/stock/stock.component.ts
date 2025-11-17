
import { Component, OnInit } from '@angular/core';
import { RetailerService } from '../../../services/retailer.service';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../../services/web-storage.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})

export class StockComponent implements OnInit {

  selectedMonth: string | null = null;
  totalCount = 0;
  resultList: any[] = [];
  groupedList: any[] = [];
  displayedColumns: string[] = [
    'Network',
    'TotalGiven',
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

  get totalGiven(): number {
    return this.groupedList.reduce((sum: any, item: any) => sum + item.totalGiven, 0);
  }

  loadData(): void {
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;
    const requestBody = {
      fromDate: this.selectedMonth,
      filterId: loggedInUserId
    };

    this.retailerService.getSimGiven(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.resultList = res.data;
        const groupedResult = Object.values(
          res.data.reduce((acc: any, item: any) => {
            if (!acc[item.baseNetwork]) {
              acc[item.baseNetwork] = { baseNetwork: item.baseNetwork, totalGiven: 0 };
            }
            acc[item.baseNetwork].totalGiven++;
            return acc;
          }, {} as Record<string, { baseNetwork: string; totalGiven: number }>)
        );
        this.groupedList = groupedResult;
      }
      else {
        this.groupedList = [];
      }
    });
  }

  loadDetails(network: any): void {
    var detailList = this.resultList.filter((f: any) => f.baseNetwork == network);
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