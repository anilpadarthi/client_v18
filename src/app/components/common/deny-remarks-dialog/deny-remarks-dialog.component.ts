import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deny-remarks-dialog',
  templateUrl: './deny-remarks-dialog.component.html',
  styleUrl: './deny-remarks-dialog.component.scss'
})
export class DenyRemarksDialogComponent {
  remarksForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { shopName: string },
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DenyRemarksDialogComponent>
  ) {
    this.remarksForm = this.fb.group({
      remarks: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.remarksForm.valid) {
      this.dialogRef.close(this.remarksForm.get('remarks')?.value);
    }
  }

  get remarksControl() {
    return this.remarksForm.get('remarks');
  }
}
