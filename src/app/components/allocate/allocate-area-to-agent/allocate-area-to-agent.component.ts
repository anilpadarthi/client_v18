import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../../services/area.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-allocate-area-to-agent',
  templateUrl: './allocate-area-to-agent.component.html',
  styleUrl: './allocate-area-to-agent.component.scss'
})

export class AllocateAreaToAgentComponent implements OnInit {

  displayedColumns: string[] = [
    'select',
    'areaId',
    'name',
    'AssingedTo',
    'Action'
  ];

  displayedColumns1: string[] = [
    'areaId',
    'name'
  ];
  areaList: any[] = [];
  tempAreaList: any[] = [];
  searchText!: string | null;
  selectedRows: any[] = [];
  selectedAgentId = null;
  selectedAgentIdForTransfer = null;
  agentLookup: any = [];
  selectedAreasToTransfer: any = [];
  selectedMonth: string | null = null;
  isBackToSelection = true;
  userFilterCtrl: FormControl = new FormControl();
  filteredUsers: any[] = [];


  constructor(
    public datePipe: DatePipe,
    private lookupService: LookupService,
    private areaService: AreaService,
    private toasterService: ToasterService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAgentLookup();
    this.loadData();
    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.agentLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.agentLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  loadData(): void {
    this.areaService.getAllAreasToAllocate().subscribe((res) => {
      this.areaList = res.data;
      this.tempAreaList = res.data;
    });
  }

  onAgentChanged(event: any) {
    if (event.value) {
      this.onFilter();
    }
  }

  onRowSelect(row: any) {
    if (row.selected) {
      this.selectedRows.push(row);
    }
    else {
      const index = this.selectedRows.indexOf(row);
      if (index >= 0) {
        this.selectedRows.splice(index, 1);
      }
    }
  }

  isAllSelected() {
    return this.selectedRows.length === this.areaList.length;
  }

  selectAll(event: any) {
    if (event.checked) {
      // Select all rows
      this.selectedRows = [...this.areaList];  // Clone the areaList array into selectedRows
      this.areaList.forEach(row => row.selected = true);  // Mark all rows as selected
    } else {
      // Deselect all rows
      this.selectedRows = [];  // Clear the selectedRows array
      this.areaList.forEach(row => row.selected = false);  // Mark all rows as unselected
    }
    // Trigger change detection    
  }

  onReset(): void {
    this.searchText = null;
    this.selectedAgentId = null;
    this.selectedAgentIdForTransfer = null;
    this.selectedMonth = null;
    this.onFilter();
  }

  onSearchEntered(value: string): void {
    this.searchText = value;
    if (this.searchText) {
      this.onFilter();
    }
  }

  onFilter(): void {
    if (this.selectedAgentId && this.searchText) {
      let filterResult = this.tempAreaList.filter(f => f.assignedToUserId == this.selectedAgentId
        && f.areaName.toLowerCase().includes(this.searchText!.toLowerCase()));
      this.areaList = filterResult;
    }
    else if (this.selectedAgentId) {
      let filterResult = this.tempAreaList.filter(f => f.assignedToUserId == this.selectedAgentId);
      this.areaList = filterResult;
    }
    else if (this.searchText) {
      let filterResult = this.tempAreaList.filter(f => f.areaName.toLowerCase().includes(this.searchText!.toLowerCase()));
      this.areaList = filterResult;
    }
    else {
      this.areaList = this.tempAreaList;
    }
  }

  backToSelection(): void {
    this.isBackToSelection = true;
  }

  transferAreas(): void {
    const requestBody = {
      agentId: this.selectedAgentIdForTransfer,
      fromDate: this.selectedMonth,
      areaIds: this.selectedAreasToTransfer.map((m: any) => m.areaId)
    };

    this.areaService.allocateAreasToAgent(requestBody).subscribe((res) => {
      this.isBackToSelection = true;
      this.loadData();
      this.toasterService.showMessage("Areas are transfered successfully.");
    });

  }

  proceedToAllocate(): void {
    this.isBackToSelection = false;
    this.selectedAreasToTransfer = this.areaList.filter(f => f.selected == true);
  }

  viewAllocationHistory(areaId: number): void {
    this.areaService.viewAreaAllocationHistory(areaId).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: 'Area Allocation History'
      }
      this.dialog.open(PopupTableComponent, {
        data
      });
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
