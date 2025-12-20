import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from '../../../services/toaster.service';
import { AreaService } from '../../../services/area.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
    selector: 'app-allocate-confirm-dialog',
    templateUrl: './allocate-confirm-dialog.component.html',
    styleUrls: ['./allocate-confirm-dialog.component.scss']
})
export class AllocateConfirmDialogComponent {

    selectedAgentIdForTransfer = null;
    selectedMonth: string | null = null;
    agentLookup: any = [];
    selectedAreas: any[] = [];
    displayedColumns1: string[] = [
        'areaId',
        'name'
    ];

    constructor(
        private toasterService: ToasterService,
        private areaService: AreaService,
        public dialogRef: MatDialogRef<AllocateConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.agentLookup = data.agentLookup;
        this.selectedAreas = data.items;
     }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    transferAreas(): void {
        const requestBody = {
            agentId: this.selectedAgentIdForTransfer,
            fromDate: this.selectedMonth,
            areaIds: this.data.items.map((m: any) => m.areaId)
        };

        this.areaService.allocateAreasToAgent(requestBody).subscribe((res) => {
            this.toasterService.showMessage("Areas are transfered successfully.");
            this.dialogRef.close(true);
        });

    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    backToSelection(): void {
        this.dialogRef.close(false);
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
