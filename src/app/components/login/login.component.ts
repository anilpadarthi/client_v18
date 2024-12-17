
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {
  loginForm!: FormGroup;
  isValidLogin = true;
  hidePassword = true;

  constructor(private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("mahesh@gmail.com", [Validators.required, Validators.email]),
      password: new FormControl("admin@123", [Validators.required, Validators.minLength(6)])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async submit(): Promise<void> {
    if (this.loginForm.valid) {
      var requestBody = {
        'email': this.loginForm.value.email,
        'password': this.loginForm.value.password
      };
      let result = await this.authService.authenticate(requestBody);
      if (!result) {
        this.isValidLogin = false;
        this._snackBar.open("Invalid username or password", "", { duration: 2000 });
      }
    }
  }
}