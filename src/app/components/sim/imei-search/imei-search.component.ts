import { Component } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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
  isAdmin: boolean = false;


  constructor(
    private simService: SimService,
    private toasterService: ToasterService,
    private webstorgeService: WebstorgeService
  ) {

    this.userRole = this.webstorgeService.getUserRole();
    this.isAdmin = this.userRole === 'Admin' || this.userRole === 'SuperAdmin' || this.userRole === 'OperationalManager';
  }

  onSearch(): void {
    const request = {
      imeiNumbers: this.searchText != null ? this.searchText.trim().toLowerCase().split('\n') : null
    };

    this.simService.getSimHistoryDetails(request).subscribe((res) => {
      if (res.data.length > 0) {
        let columns = Object.keys(res.data[0]);
        if (this.isAdmin) {
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
    this.dataSource = [];
    this.searchText = '';
  }

  downloadResults(format: 'csv' | 'xlsx'): void {
    if (!this.dataSource || this.dataSource.length === 0) {
      this.toasterService.showMessage('No results available for download.');
      return;
    }

    const exportData = this.dataSource.map((row: any) => {
      const exportRow: any = {};
      this.displayedColumns.forEach((column) => {
        let value = row[column];
        if (this.isDate(value)) {
          value = new Date(value).toLocaleDateString('en-GB');
        } else if (value !== null && value !== undefined && typeof value === 'object') {
          value = JSON.stringify(value);
        }
        exportRow[column] = value;
      });
      return exportRow;
    });

    const fileName = `IMEI_Search_Results_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      this.exportAsCsv(exportData, fileName);
    } else {
      this.exportAsExcel(exportData, fileName);
    }
  }

  private exportAsCsv(data: any[], fileName: string): void {
    const header = this.displayedColumns;
    const csvRows = [header.join(',')];

    data.forEach((row) => {
      const values = this.displayedColumns.map((column) => {
        let value = row[column] !== null && row[column] !== undefined ? row[column].toString() : '';
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  private exportAsExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}.xlsx`);
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

}
