import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { DatePipe } from '@angular/common';
import { WebstorgeService } from '../../../services/web-storage.service';
import { LookupService } from '../../../services/lookup.service';
import { FormControl } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrl: './message-center.component.scss'
})

export class MessageCenterComponent implements OnInit {

  fromDate = null;
  toDate = null;
  resultList: any = [];
  isAdminOrManager = false;
  selectedUserId = null;
  userLookup: any = [];
  filteredUsers: any[] = [];
  userFilterCtrl: FormControl = new FormControl();
  userRole: string = '';
  displayedColumns: string[] = [
    'orderId',
    'orderStatus',
    'paymentMethod',
    'paidDate'
  ];

  constructor(
    public datePipe: DatePipe,
    private reportService: ReportService,
    private webstorgeService: WebstorgeService,
    private lookupService: LookupService,
    private toastService: ToasterService
  ) { }

  ngOnInit(): void {

    this.defaultValueAccessor();

    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin' || this.userRole == 'Manager') {
      this.getAgentLookup();
    }

    this.userFilterCtrl.valueChanges.subscribe(() => {
      this.filterUsers();
    });
  }

  onFilter(): void {
    if (this.fromDate && this.toDate) {
      const requestBody = {
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
        filterId: this.selectedUserId
      };

      this.reportService.getMessageCenterData(requestBody).subscribe((res) => {
        if (res.statusCode == 200) {
          this.resultList = res.data;
        }
        else {
          this.resultList = [];
        }
      });
    }
    else{
      this.toastService.showMessage('Please select both From Date and To Date.');
    }
  }

  getAgentLookup() {
    this.lookupService.getAgents().subscribe((res) => {
      this.userLookup = res.data;
      this.filteredUsers = res.data;
    });
  }

  private filterUsers() {
    const search = this.userFilterCtrl.value?.toLowerCase() || '';
    this.filteredUsers = this.userLookup.filter((item: any) =>
      `${item.id} - ${item.name}`.toLowerCase().includes(search)
    );
  }

  onClear(): void {
    this.fromDate = null;
    this.toDate = null;
    this.resultList = [];
    this.defaultValueAccessor();
  }

  defaultValueAccessor(): void {
    this.userRole = this.webstorgeService.getUserRole();
    let loggedInUserId = this.webstorgeService.getUserInfo().userId;
    if (this.userRole == 'Admin' || this.userRole == 'SuperAdmin' || this.userRole == 'Manager') {
      this.isAdminOrManager = true;
    }
    else if (this.userRole == 'Agent') {
      this.selectedUserId = loggedInUserId;
    }
  }

}