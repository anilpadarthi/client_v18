import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { AccountService } from '../../../../services/account.service';

export type ForgotPasswordMode = 'agent' | 'retailer';

export interface ForgotPasswordDialogData {
  mode: ForgotPasswordMode;
}

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
  forgotForm: FormGroup;

  loading = false;
  submitted = false;
  message = '';



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private accountService: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: ForgotPasswordDialogData
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {

    if (this.loading) {
      return;
    }

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    const email = this.forgotForm.value.email!;

    const request: Observable<any> = this.accountService.forgotPassword(email, this.data.mode);

    request
      .subscribe({
        next: (response) => {
          this.submitted = true;
          this.loading = false;
          this.message = response.message || 'If the email exists, a password reset link has been sent.';
        },
        error: (error) => {
          this.loading = false;
          this.message =
            'Unable to process your request. Please try again later.';
        }
      });
  }
}
