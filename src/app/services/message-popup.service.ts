import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from '../components/shared/message-popup/message-popup.component';

@Injectable({
  providedIn: 'root',
})
export class MessagePopupService {
  constructor(private dialog: MatDialog) {}

  show(message: string, duration: number = 3000): void {
    const dialogRef = this.dialog.open(MessagePopupComponent, {
      data: { message },
      panelClass: 'message-popup-dialog',
      disableClose: true,
    });

    setTimeout(() => {
      dialogRef.close();
    }, duration);
  }
}
