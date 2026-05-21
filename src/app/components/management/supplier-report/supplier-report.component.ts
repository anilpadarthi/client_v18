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
  mergedDataSource: any = [];
  footerTotals: any = {};
  supplierFilterCtrl: FormControl = new FormControl();
  filteredSuppliers: any[] = [];
  networkColumns: string[] = [];

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
          this.mergedDataSource = result;

          if (this.mergedDataSource?.length) {

            //------------------------------------------------
            // Dynamic Networks
            //------------------------------------------------

            this.networkColumns = Object.keys(this.mergedDataSource[0])

              .filter(key =>
                key.endsWith('_Uploaded') ||
                key.endsWith('_Activated')
              )

              .map(key =>
                key
                  .replace('_Uploaded', '')
                  .replace('_Activated', '')
              )

              .filter((value, index, self) =>
                self.indexOf(value) === index
              );

            //------------------------------------------------
            // Calculate Totals
            //------------------------------------------------

            this.mergedDataSource.forEach((row: any) => {

              row.TotalUploaded = this.networkColumns
                .reduce((sum, network) =>
                  sum + (+row[network + '_Uploaded'] || 0), 0);

              row.TotalActivated = this.networkColumns
                .reduce((sum, network) =>
                  sum + (+row[network + '_Activated'] || 0), 0);

            });

            this.calculateFooterTotals();
          }
        }
        else {
          this.mergedDataSource = [];
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
    this.mergedDataSource = [];
    this.footerTotals = {};
  }

  private calculateFooterTotals(): void {
    this.footerTotals = {
      TotalUploaded: 0,
      TotalActivated: 0,
    };

    this.networkColumns.forEach((network) => {
      this.footerTotals[network + '_Uploaded'] = 0;
      this.footerTotals[network + '_Activated'] = 0;
    });

    this.mergedDataSource.forEach((row: any) => {
      this.networkColumns.forEach((network) => {
        this.footerTotals[network + '_Uploaded'] += +row[network + '_Uploaded'] || 0;
        this.footerTotals[network + '_Activated'] += +row[network + '_Activated'] || 0;
      });

      this.footerTotals.TotalUploaded += +row.TotalUploaded || 0;
      this.footerTotals.TotalActivated += +row.TotalActivated || 0;
    });
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