import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebstorgeService } from './web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string;
  isAuthenticated = false;

  constructor(
    private router: Router,
    public http: HttpClient,
    private webstorgeService: WebstorgeService,
  ) {

    this.url = `api/login`
  }

  isLoggedIn(): boolean {
    // Check if the user is logged in (e.g., using local storage)
    return !!localStorage.getItem('token');
    //return this.isAuthenticated;
  }

  authenticate(requstBody: any): boolean {
    this.http.post<any>(this.url + '/Authenticate', requstBody).subscribe((res) => {
      if (res && res.data && res.data.token) {
        this.webstorgeService.setSession(res.data.token);
        this.webstorgeService.setUserInfo(res.data.userDetails);
        this.router.navigate(['/home']);
        this.isAuthenticated = true;
        return this.isAuthenticated;
      }
      else {
        this.isAuthenticated = false;
        return this.isAuthenticated;
      }
    });
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.router.navigate(['/login']); // Redirect to the login page
  }
}