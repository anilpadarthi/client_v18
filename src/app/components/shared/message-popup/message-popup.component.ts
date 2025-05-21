import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-popup',
  template: `
    <div class="popup-message">
      <mat-icon class="popup-icon">info</mat-icon>
      <span class="popup-text">{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .popup-message {
      display: flex;
      align-items: center;
      padding: 16px;
      font-size: 16px;
      color: #fff;
      background-color: #323232;
      border-radius: 4px;
      min-height:10vh;
    }

    .popup-icon {
      margin-right: 10px;
    }

    .popup-text {
      flex: 1;
    }
  `]
})
export class MessagePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
}
