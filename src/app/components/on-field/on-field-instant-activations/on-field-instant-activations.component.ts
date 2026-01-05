import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { OnFieldService } from '../../../services/on-field.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-on-field-instant-activations',
  templateUrl: './on-field-instant-activations.component.html',
  styleUrl: './on-field-instant-activations.component.scss'
})

export class OnFieldInstantActivationsComponent implements OnInit {
  @Input() selectedShopId!: number;
  @Input() refreshValue!: number;
  @Input() selectedYear!: number;
  fromDate: any;
  toDate: any;
  private isFirstChange = true;
  isLoading = false;
  activationList: any = [];
  displayedColumns: string[] = [
    'DATE',
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFGAFF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
    'TOTAL'
  ];

  constructor(
    public datePipe: DatePipe,
    private onFieldService: OnFieldService,
  ) { }

  ngOnInit(): void {
    if (this.selectedShopId > 0) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.getReportFromAndToDates();
    const request = {
      shopId: this.selectedShopId,
      isInstantActivation: true,
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    this.onFieldService.onFieldActivationList(request).subscribe((res) => {
      this.isLoading = false;
      if (res.data) {
        let result = res.data;
        result.forEach((e: any) => {
          e.total = e.ee + e.three + e.o2 + e.giffgaff + e.lebara + e.vodafone + e.voxi + e.smarty;
        });
        this.activationList = result;
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

  private getReportFromAndToDates(months: number = 6): void {

    if (this.selectedYear === 0) {
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

      this.fromDate = this.datePipe.transform(fDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(tDate, 'yyyy-MM-dd');

    } else {
      // Selected year logic
      const year = this.selectedYear;

      const fromDate = new Date(year, 0, 1);   // Jan 1
      const toDate = new Date(year, 11, 1);    // Dec 1 (month start)

      this.fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');
    }
  }

}
