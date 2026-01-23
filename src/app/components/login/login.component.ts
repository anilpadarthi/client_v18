
import { Component, HostListener } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { AuthService } from '../../services/auth.service';
import { GeolocationService } from '../../services/geolocation.service';
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
  isMobile = false;
  geoLocation: any;
  geoLocationPromise: Promise<any> | null = null;


  constructor(private router: Router,
    private authService: AuthService,
    private toasterService: ToasterService,
    private geolocationService: GeolocationService,
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
    this.fetchLocation();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  async submit(): Promise<void> {
    //this.toasterService.showMessage(this.geoLocation.latitude + ', ' + this.geoLocation.longitude);
    // If location not yet available, try to wait for an in-flight request
    if (this.geoLocation == null) {
      if (!this.geoLocationPromise) {
        this.fetchLocation();
      }

      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      try {
        await Promise.race([this.geoLocationPromise || Promise.resolve(null), wait(5000)]);
      }
      catch (e) {
        // ignore; we'll check geoLocation below
      }
    }

    if (this.geoLocation != null) {
      if (this.loginForm.valid) {
        var requestBody = {
          'username': this.loginForm.value.email,
          'password': this.loginForm.value.password,
          'latitude': String(this.geoLocation.latitude),
          'longitude': String(this.geoLocation.longitude),
        };

        this.authService.login(requestBody).subscribe({
            next: () => this.router.navigate(['/home']),
            error: err => this.toasterService.showMessage('Login Failed.')
        });        
      }
    }
    else {
      this.toasterService.showMessage("Please turn on location services, to proceed further.");
    }
  }

  fetchLocation(): void {
    if (environment.isGeoLocationTurnOn) {
      this.geoLocationPromise = this.geolocationService.getCurrentLocation()
        .then((position) => {
          this.geoLocation = position.coords;
          return position;
        })
        .catch((error) => {
          console.error('Geolocation error:', error);
          switch (error.code) {
            case 1:
              console.error('Permission denied.');
              break;
            case 2:
              console.error('Position unavailable.');
              break;
            case 3:
              console.error('Timeout.');
              break;
            default:
              console.error('Unknown error.');
          }
          return null;
        });
    }
    else {
      this.geoLocation = {
        latitude: '17.17',
        longitude: '17.17'
      };
    }
  }

  retailerLogin(): void {
    this.router.navigate(['/retailer/login']);
  }

}