import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { LookupService } from '../../../services/lookup.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-supplier-report',
  templateUrl: './supplier-report.component.html',
  styleUrl: './supplier-report.component.scss'
})

export class SupplierReportComponent implements OnInit {

  selectedMonth: string | null = null;
  selectedSupplierId = null;
  supplierLookup: any = [];
  activationList: any = [];
  supplierFilterCtrl: FormControl = new FormControl();
  filteredSuppliers: any[] = [];

  eeSum: number = 0;
  threeSum: number = 0;
  o2Sum: number = 0;
  gifgafSum: number = 0;
  vodafoneSum: number = 0;
  lebaraSum: number = 0;
  lycaSum: number = 0;
  voxiSum: number = 0;
  smartySum: number = 0;
  totalSum: number = 0;

  displayedColumns: string[] = [
    'SupplierName',
    'SupplierAccountName',
    'SupplierId',
    'EE',
    'THREE',
    'O2',
    'LEBARA',
    'GIFFGAFF',
    'VODAFONE',
    'VOXI',
    'SMARTY',
    'TOTAL'
  ];

  constructor(
    public datePipe: DatePipe,
    private lookupService: LookupService,
    private reportService: ReportService,
    private toasterService: ToasterService
  ) { }


  ngOnInit(): void {
    this.getSupplierLookup();


    this.supplierFilterCtrl.valueChanges.subscribe(() => {
      this.filterSuppliers();
    });
  }

  private filterSuppliers() {
    const search = this.supplierFilterCtrl.value?.toLowerCase() || '';
    this.filteredSuppliers = this.supplierLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getSupplierLookup() {
    this.lookupService.getSuppliers().subscribe((res) => {
      this.supplierLookup = res.data;
      this.filteredSuppliers = res.data;
    });
  }

  loadData(): void {
    if (this.selectedMonth) {

      const requestBody = {
        fromDate: this.selectedMonth,
        filterId: this.selectedSupplierId,
      };

      this.reportService.getSupplierActivationReport(requestBody).subscribe((res) => {
        if (res.data?.length > 0) {
          let result = res.data;
          result.forEach((e: any) => {
            e.total = e.ee + e.three + e.o2 + e.giffgaff + e.lebara + e.vodafone + e.voxi + e.smarty;
          });
          this.activationList = result;
          this.calculateSums();
        }
        else {
          this.activationList = [];
        }
      });
    }
    else {
      this.toasterService.showMessage("Please select any month");
    }
  }

  onFilter(): void {
    this.loadData();
  }



  onClear(): void {
    this.selectedMonth = null;
    this.selectedSupplierId = null;
    this.activationList = [];
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

  calculateSums() {
    this.eeSum = this.activationList.reduce((sum: any, item: any) => sum + item.ee, 0);
    this.threeSum = this.activationList.reduce((sum: any, item: any) => sum + item.three, 0);
    this.o2Sum = this.activationList.reduce((sum: any, item: any) => sum + item.o2, 0);
    this.gifgafSum = this.activationList.reduce((sum: any, item: any) => sum + item.giffgaff, 0);
    this.vodafoneSum = this.activationList.reduce((sum: any, item: any) => sum + item.vodafone, 0);
    this.lebaraSum = this.activationList.reduce((sum: any, item: any) => sum + item.lebara, 0);
    this.lycaSum = this.activationList.reduce((sum: any, item: any) => sum + item.lyca, 0);
    this.voxiSum = this.activationList.reduce((sum: any, item: any) => sum + item.voxi, 0);
    this.smartySum = this.activationList.reduce((sum: any, item: any) => sum + item.smarty, 0);

    this.totalSum = this.eeSum + this.threeSum
      + this.o2Sum + this.gifgafSum
      + this.vodafoneSum + this.lebaraSum
      + this.voxiSum + this.smartySum;
  }

}