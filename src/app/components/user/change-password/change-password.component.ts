import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;
  loading = false;

  constructor(private fb: FormBuilder,
    public toasterService: ToasterService,
    public userService: UserService
  ) {

    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // clear error if previously set
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }


  onSubmit() {
    if (this.changePasswordForm.invalid) return;

    this.loading = true;
    const payload = {
      oldPassword: this.f['oldPassword'].value,
      newPassword: this.f['newPassword'].value
    };

    this.userService.changePassword(payload).subscribe((res) => {
      this.loading = false;
      this.toasterService.showMessage(res.data);
      if (res.statusCode == 200) {
        this.changePasswordForm.reset();
      }
    });
  }

  onCancel() {
    this.changePasswordForm.reset();
  }

}
