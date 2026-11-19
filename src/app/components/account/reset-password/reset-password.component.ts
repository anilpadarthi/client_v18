import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  showNewPassword = false;
  showConfirmPassword = false;
  token = '';
  isTokenValid = false;
  isVerifying = true;
  errorMessage = '';
  loading = false;
  submitted = false
  successMessage = '';




  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {

    this.token =
      this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.isVerifying = false;
      this.errorMessage = 'Invalid password reset link.';
      return;
    }

    this.accountService.verifyResetToken(this.token)
      .subscribe({
        next: () => {
          this.isTokenValid = true;
          this.isVerifying = false;
        },
        error: () => {
          this.isTokenValid = false;
          this.isVerifying = false;
          this.errorMessage =
            'Your password reset link is invalid or expired.';
        }
      });
  }

  resetForm: FormGroup;

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('newPassword')?.value;
    const confirmPassword =
      control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  submit(): void {

    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const request = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword!,
      confirmPassword: this.resetForm.value.confirmPassword!
    };

    this.accountService.resetPassword(request)
      .subscribe({
        next: (response) => {

          this.loading = false;
          this.submitted = true;

          this.successMessage =
            'Your password has been reset successfully.';

          this.token = '';
        },
        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message ||
            'Unable to reset password. Please request a new link.';
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}