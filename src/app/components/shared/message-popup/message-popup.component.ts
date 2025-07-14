import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-popup',
  template: `
    <div class="popup-message">
  <!-- Header with Close Icon -->
  <div class="popup-header">
    <span class="popup-title">Info</span>
    <mat-icon class="popup-close" (click)="onClose()">close</mat-icon>
  </div>

  <!-- Body with Icon and Message -->
  <div class="popup-body">
    <mat-icon class="popup-icon">info</mat-icon>
    <span class="popup-text">{{ data.message }}</span>
  </div>
</div>
  `,
  styles: [`
    .popup-message {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  min-width: 300px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.popup-title {
  font-size: 16px;
  color: #0d47a1;
}

.popup-close {
  cursor: pointer;
  font-size: 20px;
  color: #555;
}

.popup-body {
  display: flex;
  align-items: center;
}

.popup-icon {
  margin-right: 8px;
  color: #1976d2;
}

.popup-text {
  font-size: 14px;
}
  `]
})
export class MessagePopupComponent {
  constructor(private dialogRef: MatDialogRef<MessagePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

  onClose(): void {
    this.dialogRef.close();
  }
}
