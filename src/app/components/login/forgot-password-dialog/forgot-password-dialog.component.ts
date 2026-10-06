import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
  forgotForm: FormGroup;
  isSubmitting = false;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private toasterService: ToasterService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.forgotForm.get('email')?.value.trim();

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toasterService.showMessage('Password reset link has been sent to your email address.');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSubmitting = false;
        const message = err?.error?.message || err?.error || 'Unable to send the password reset link. Please try again.';
        this.toasterService.showMessage(message);
      }
    });
  }
}
