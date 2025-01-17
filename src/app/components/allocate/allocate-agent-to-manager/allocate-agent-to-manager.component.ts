import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LookupService } from '../../../services/lookup.service';
import { ToasterService } from '../../../services/toaster.service';
import { DatePipe } from '@angular/common';

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
  fromDate: any;
  isBackToSelection = true;

  constructor(
    public datePipe: DatePipe,
    private lookupService: LookupService,
    private userService: UserService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
    this.getManagerLookup();
    this.loadData();
  }

  getManagerLookup() {
    this.lookupService.getManagers().subscribe((res) => {
      this.managerLookup = res.data;
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
    if (this.selectedManagerId && this.searchText) {
      let filterResult = this.tempAgentList.filter(f => f.assignedToUserId == this.selectedManagerId
        && f.areaName.toLowerCase().includes(this.searchText!.toLowerCase()));
      this.agentList = filterResult;
    }
    else if (this.selectedManagerId) {
      let filterResult = this.tempAgentList.filter(f => f.assignedToUserId == this.selectedManagerId);
      this.agentList = filterResult;
    }
    else if (this.searchText) {
      let filterResult = this.tempAgentList.filter(f => f.areaName.toLowerCase().includes(this.searchText!.toLowerCase()));
      this.agentList = filterResult;
    }
    else {
      this.agentList = this.tempAgentList;
    }
  }

  backToSelection(): void {
    this.isBackToSelection = true;
  }

  transferAreas(): void {
    const requestBody = {
      managerId: this.selectedMangerIdForTransfer,
      fromDate: this.fromDate,
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

}


