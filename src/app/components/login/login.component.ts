
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { WebstorgeService } from '../../services/web-storage.service';
import { ToasterService } from '../../services/toaster.service';
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
    private loginService: LoginService,
    private webstorgeService: WebstorgeService,
    private toasterService: ToasterService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("leapdist@gmail.com", [Validators.required, Validators.email]),
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

      this.loginService.authenticate(requestBody).subscribe((res) => {
        if (res && res.data && res.data.token) {
          this.isValidLogin = true;
          this.webstorgeService.setSession(res.data.token);
          this.webstorgeService.setUserInfo(res.data.userDetails);
          this.router.navigate(['/home']);
        }
        else {
          this.isValidLogin = false;
          this.toasterService.showMessage("Invalid username or password");
        }
      });
    }
  }
}