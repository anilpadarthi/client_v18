import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-quantity-dialog',
  templateUrl: './add-quantity-dialog.component.html',
  styleUrls: ['./add-quantity-dialog.component.scss']
})
export class AddQuantityDialogComponent {
  quantityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private fb: FormBuilder
  ) {
    this.quantityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSave(): void {
    if (this.quantityForm.valid) {
      const quantity = this.quantityForm.value.quantity;
      this.dialogRef.close({ quantity });
    }
  }
}