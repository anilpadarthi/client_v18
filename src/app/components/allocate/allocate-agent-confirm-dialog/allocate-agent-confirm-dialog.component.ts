import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from '../../../services/toaster.service';
import { UserService } from '../../../services/user.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-allocate-agent-confirm-dialog',
  templateUrl: './allocate-agent-confirm-dialog.component.html',
  styleUrls: ['./allocate-agent-confirm-dialog.component.scss']
})
export class AllocateAgentConfirmDialogComponent {

  selectedManagerIdForTransfer = null;
  selectedMonth: string | null = null;
  managerLookup: any = [];
  selectedAgents: any[] = [];
  displayedColumns1: string[] = [
    'agentId',
    'agentName'
  ];

  constructor(
    private toasterService: ToasterService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AllocateAgentConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.managerLookup = data.managerLookup;
    this.selectedAgents = data.items;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  transferAgents(): void {
    const requestBody = {
      managerId: this.selectedManagerIdForTransfer,
      fromDate: this.selectedMonth,
      agentIds: this.data.items.map((m: any) => m.userId)
    };

    this.userService.allocateAgentsToManager(requestBody).subscribe((res) => {
      this.toasterService.showMessage('Agents are transfered successfully.');
      this.dialogRef.close(true);
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  backToSelection(): void {
    this.dialogRef.close(false);
  }

  chosenYearHandler(normalizedYear: any) {
    // no-op
  }

  chosenMonthHandler(normalizedMonth: any, datepicker: MatDatepicker<any>) {
    const formattedMonth = moment(normalizedMonth).format('YYYY-MM');
    this.selectedMonth = formattedMonth + '-01';
    datepicker.close();
  }

}
