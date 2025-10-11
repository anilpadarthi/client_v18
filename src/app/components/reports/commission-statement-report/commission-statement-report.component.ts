import { Component, OnInit } from '@angular/core';
import { CommissionStatementService } from '../../../services/commissionStatement.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { WebstorgeService } from '../../../services/web-storage.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-commission-statement-report',
  templateUrl: './commission-statement-report.component.html',
  styleUrl: './commission-statement-report.component.scss'
})


export class CommissionStatementReportComponent implements OnInit {

  selectedAreaId = null;
  selectedShopId = null;
  selectedUserId = null;
  filterMode = 'All';
  filterExcelMode = 'All';
  totalCount = 0;
  monthDate: string | null = null;
  fromMonth: string | null = null;
  toMonth: string | null = null;
  areaLookup: any = [];
  shopLookup: any = [];
  userLookup: any = [];
  commissionList: any = [];
  isLoading = false;
  userRole = '';
  areaFilterCtrl: FormControl = new FormControl();
  shopFilterCtrl: FormControl = new FormControl();
  filteredAreas: any[] = [];
  filteredShops: any[] = [];
  userFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];
  isDisplayChequeInfo = true;

  displayedColumns: string[] = [
    'Action',
    'UserName',
    'AreaName',
    'ShopName',
    'CommissionDate',
    'CommissionAmount',
    'BonusAmount',
    'OptInType'
  ];

  constructor(
    private datePipe: DatePipe,
    private commissionStatementService: CommissionStatementService,
    private webstorgeService: WebstorgeService,
    private lookupService: LookupService,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userRole = this.webstorgeService.getUserRole();
   
    this.getAreaLookup();
    this.getAgentLookup();

    this.areaFilterCtrl.valueChanges.subscribe(() => {
      this.filterAreas();
    });
    this.shopFilterCtrl.valueChanges.subscribe(() => {
      this.filterShops();
    });
    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  private filterAreas() {
    const search = this.areaFilterCtrl.value?.toLowerCase() || '';
    this.filteredAreas = this.areaLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  private filterShops() {
    const search = this.shopFilterCtrl.value?.toLowerCase() || '';
    this.filteredShops = this.shopLookup.filter((item: any) =>
      `${item.oldId} - ${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }
  
  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  getAreaLookup() {
    this.lookupService.getAreas().subscribe((res) => {
      this.areaLookup = res.data;
      this.filteredAreas = res.data;
    });
  }

  areaChange() {
    this.lookupService.getShops(this.selectedAreaId).subscribe((res) => {
      this.shopLookup = res.data;
      this.filteredShops = res.data;
    });
  }

  loadData(): void {
    this.isLoading = true;
    const requestBody = {
      fromDate: this.fromMonth,
      toDate: this.toMonth,
      areaId: this.selectedAreaId,
      shopId: this.selectedShopId,
      userId: this.selectedUserId,
      filterMode: this.filterMode
    };

    this.commissionStatementService.getCommissionList(requestBody).subscribe((res) => {
      if (res.data?.length > 0) {
        this.commissionList = res.data;
      }
      else {
        this.commissionList = null;
      }
      this.isLoading = false;
    });
  }

  onFilter(): void {
    this.loadData();
  }

  onReset(): void {
    this.selectedAreaId = null;
    this.selectedShopId = null;
    this.fromMonth = null;
    this.toMonth = null;
    this.selectedUserId = null;
    this.filterMode = 'All';
    this.commissionList = [];
  }  

  downloadCommissionStatement(shopId: number, fromDate: string): void {
    this.commissionStatementService.downloadCommissionStatement(shopId, fromDate);
  }

  exportToPDF(mode: any): void {
    let requestBody = {
      fromDate: this.fromMonth,
      toDate: this.toMonth,
      areaId: this.selectedAreaId,
      shopId: this.selectedShopId,
      userId: this.selectedUserId,
      reportType: mode,
      filterMode: this.filterMode,
      isDisplayChequeInfo: this.isDisplayChequeInfo

    }
    this.toasterService.showMessage("Downloading...");
    this.commissionStatementService.downloadPDFStatementReport(requestBody).subscribe((res) => {
      if (res) {
        this.toasterService.showMessage("Successfully downloaded.");
      }
    });
  }

  exportToExcel(): void {    
     if(this.monthDate && this.filterExcelMode){
      this.toasterService.showMessage("Downloading...");
      this.commissionStatementService.exportCommissionChequeExcel(this.filterExcelMode, this.monthDate);
    }
    else {
      this.toasterService.showMessage('Please select month before proceeding.')
    }
  }

  // Handle Year Selection (no action needed)
  chosenYearHandler(normalizedYear: any) {
    // No action required, just wait for month selection
  }

  // Handle Month Selection
  choseFromMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.fromMonth = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
    return formattedMonth + "-01";
  }

  // Handle Month Selection
  choseFromMonth1Handler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.monthDate = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
    return formattedMonth + "-01";
  }

  choseToMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM'); // Example format: 2025-03
    this.toMonth = formattedMonth + "-01";
    datepicker.close(); // Close picker after selection
  }

}