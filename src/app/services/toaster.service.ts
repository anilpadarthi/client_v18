import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class ToasterService {
  constructor(private snackBar: MatSnackBar) {}

  showMessage(message: string, duration: number = 3000) {
    this.snackBar.open(message, '', {
      duration,
      horizontalPosition: 'center', // Align horizontally in the center
      verticalPosition: 'top', // Align vertically in the middle
      panelClass: ['custom-snackbar'], // Custom styles
    });
  }
}
