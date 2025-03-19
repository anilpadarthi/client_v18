
import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { WebstorgeService } from '../../services/web-storage.service';
import { ToasterService } from '../../services/toaster.service';
import { GeolocationService } from '../../services/geolocation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {
  loginForm!: FormGroup;
  isValidLogin = true;
  hidePassword = true;
  geoLocation: any;


  constructor(private router: Router,
    private loginService: LoginService,
    private webstorgeService: WebstorgeService,
    private toasterService: ToasterService,
    private geolocationService: GeolocationService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("leapdist@gmail.com", [Validators.required, Validators.email]),
      password: new FormControl("Elephnat@123", [Validators.required, Validators.minLength(4)])
    });
    this.fetchLocation();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async submit(): Promise<void> {
    if (this.geoLocation != null) {
      if (this.loginForm.valid) {
        var requestBody = {
          'email': this.loginForm.value.email,
          'password': this.loginForm.value.password,
          'latitude': String(this.geoLocation.latitude),
          'longitude': String(this.geoLocation.longitude),
        };

        this.loginService.authenticate(requestBody).subscribe((res) => {
          if (res && res.data && res.data.token) {
            this.isValidLogin = true;
            this.webstorgeService.setSession(res.data.token);
            this.webstorgeService.setUserInfo(res.data.userDetails);
            if (res.data.userNotifications != null && res.data.userNotifications.length > 0) {
              this.toasterService.showMessage(res.data.userNotifications[0]);
            }
            this.router.navigate(['/home']);
          }
          else {
            this.isValidLogin = false;
            this.toasterService.showMessage("Invalid username or password");
          }
        });
      }
    }
    else {
      this.toasterService.showMessage("Please turn on location services, to proceed further.");
    }
  }

  fetchLocation(): void {
    if (environment.isGeoLocationTurnOn) {
      this.geolocationService.getCurrentLocation().then(
        (position) => {
          this.geoLocation = position;
        },
        (error) => {
          console.log(error);
        });
    }
    else {
      this.geoLocation = {
        latitude: '17.17',
        longitude: '17.17'
      };
    }
  }

}