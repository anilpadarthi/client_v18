import { Component, HostListener } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-retailer-login',
  templateUrl: './retailer-login.component.html',
  styleUrl: './retailer-login.component.scss'
})


export class RetailerLoginComponent {

  loginForm!: FormGroup;
  isValidLogin = true;
  hidePassword = true;
  isMobile = false;


  constructor(private router: Router,
    private authService: AuthService,
    private toasterService: ToasterService,
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required, Validators.minLength(4)])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async submit(): Promise<void> {
    //this.toasterService.showMessage(this.geoLocation.latitude + ', ' + this.geoLocation.longitude);
    if (this.loginForm.valid) {
      var requestBody = {
        'username': this.loginForm.value.email,
        'password': this.loginForm.value.password,
      };

      this.authService.retailerLogin(requestBody).subscribe({
        next: (response: any) => {
          // Consider API's status fields
          this.authService.storeTokens(response);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          // Network / CORS errors typically have status === 0
          if (err && err.status === 0) {
            this.toasterService.showMessage('Service is down');
            return;
          }

          // Prefer structured API error message when available
          const apiMessage = err?.error;
          this.toasterService.showMessage(apiMessage);
          this.router.navigate(['/retailer/login']);
        }
      });
    }
  }

  AgentLogin(): void {
    this.router.navigate(['/login']);
  }
}