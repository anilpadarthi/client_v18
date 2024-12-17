import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})


export class ConfirmDialogComponent {
  title: string = '';
  message: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {
    this.title = data.title;
    this.message = data.message;
  }
}
