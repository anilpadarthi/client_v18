import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../../services/area.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';

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
  fromDate: any;
  isBackToSelection = true;

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
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.agentLookup = res.data;
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
    this.fromDate = null;
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
      fromDate: this.setFirstDayOfMonth(this.fromDate),
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

  setFirstDayOfMonth(date: Date): Date {
    const firstDay = new Date(date);
    firstDay.setDate(1);
    firstDay.setDate(firstDay.getDate() + 1); // Set the day to the 1st of the month
    return firstDay;
  }

}
