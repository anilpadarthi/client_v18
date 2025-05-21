import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopupTableComponent } from '../../common/popup-table/popup-table.component';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-allocate-agent-to-manager',
  templateUrl: './allocate-agent-to-manager.component.html',
  styleUrl: './allocate-agent-to-manager.component.scss'
})

export class AllocateAgentToManagerComponent implements OnInit {

  displayedColumns: string[] = [
    'select',
    'agentId',
    'agentName',
    'assingedTo',
    'action'
  ];

  displayedColumns1: string[] = [
    'agentId',
    'agentName'
  ];
  agentList: any[] = [];
  tempAgentList: any[] = [];
  searchText!: string | null;
  selectedRows: any[] = [];
  selectedManagerId = null;
  selectedMangerIdForTransfer = null;
  managerLookup: any = [];
  selectedAgentsToTransfer: any = [];
  selectedMonth: string | null = null;
  isBackToSelection = true;
  managerFilterCtrl: FormControl = new FormControl();
  filteredManagers: any[] = [];

  constructor(
    public datePipe: DatePipe,
    private lookupService: LookupService,
    private userService: UserService,
    private toasterService: ToasterService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getManagerLookup();
    this.loadData();

    this.managerFilterCtrl.valueChanges.subscribe(() => {
      this.filterManagers();
    });
  }

  private filterManagers() {
    const search = this.managerFilterCtrl.value?.toLowerCase() || '';
    this.filteredManagers = this.managerLookup.filter((item:any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  getManagerLookup() {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
      this.filteredManagers = res.data;
    });
  }

  loadData(): void {
    this.userService.getAllAgentsToAllocate().subscribe((res) => {
      this.agentList = res.data;
      this.tempAgentList = res.data;
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
    return this.selectedRows.length === this.agentList.length;
  }

  selectAll(event: any) {
    if (event.checked) {
      // Select all rows
      this.selectedRows = [...this.agentList];  // Clone the agentList array into selectedRows
      this.agentList.forEach(row => row.selected = true);  // Mark all rows as selected
    } else {
      // Deselect all rows
      this.selectedRows = [];  // Clear the selectedRows array
      this.agentList.forEach(row => row.selected = false);  // Mark all rows as unselected
    }
    // Trigger change detection    
  }

  onReset(): void {
    this.searchText = null;
    this.selectedManagerId = null;
    this.selectedMangerIdForTransfer = null;
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
    if (this.selectedManagerId && this.searchText) {
      let filterResult = this.tempAgentList.filter(f => f.assignedToUserId == this.selectedManagerId
        && f.userName.toLowerCase().includes(this.searchText!.toLowerCase()));
      this.agentList = filterResult;
    }
    else if (this.selectedManagerId) {
      let filterResult = this.tempAgentList.filter(f => f.assignedToUserId == this.selectedManagerId);
      this.agentList = filterResult;
    }
    else if (this.searchText) {
      let filterResult = this.tempAgentList.filter(f => f.userName.toLowerCase().includes(this.searchText!.toLowerCase()));
      this.agentList = filterResult;
    }
    else {
      this.agentList = this.tempAgentList;
    }
  }

  backToSelection(): void {
    this.isBackToSelection = true;
  }

  transferAgents(): void {
    const requestBody = {
      managerId: this.selectedMangerIdForTransfer,
      fromDate: this.selectedMonth,
      agentIds: this.selectedAgentsToTransfer.map((m: any) => m.userId)
    };

    this.userService.allocateAgentsToManager(requestBody).subscribe((res) => {
      this.isBackToSelection = true;
      this.loadData();
      this.toasterService.showMessage("Agents are transfered successfully.");
    });

  }

  proceedToAllocate(): void {
    this.isBackToSelection = false;
    this.selectedAgentsToTransfer = this.agentList.filter(f => f.selected == true);
  }

  viewAllocationHistory(userId: number): void {
    this.userService.viewUserAllocationHistory(userId).subscribe((res) => {
      var data = {
        result: res.data,
        headerName: 'Agent Allocation History'
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
