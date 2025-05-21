import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MessagePopupComponent } from '../components/shared/message-popup/message-popup.component';

@Injectable({
  providedIn: 'root'
})

export class ToasterService {
  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  showMessage(message: string, duration: number = 3000) {
    const dialogRef = this.dialog.open(MessagePopupComponent, {
      data: { message },
      panelClass: 'message-popup-dialog',
      disableClose: true,
    });

    setTimeout(() => {
      dialogRef.close();
    }, duration);

    // this.snackBar.open(message, '', {
    //   duration,
    //   horizontalPosition: 'center', // Align horizontally in the center
    //   verticalPosition: 'top', // Align vertically in the middle
    //   panelClass: ['custom-snackbar'], // Custom styles
    // });
  }

}
