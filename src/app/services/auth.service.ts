import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasValidTokens());
  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/auth`
  }

  /** 🔹 Login and store tokens */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, credentials)
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  /** 🔹 Refresh tokens using refresh token */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.url}/refresh`, { refreshToken })
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }

  /** 🔹 Logout */
  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('userDetailsInfo');
    this.loggedIn$.next(false);
  }

  /** 🔹 Access token helpers */
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /** 🔹 Store tokens */
  private storeTokens(response: AuthResponse) {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem('userDetailsInfo', JSON.stringify(response.userDetails));   
    this.loggedIn$.next(true);
  }

  /** 🔹 Token validation (optional simple check) */
  hasValidTokens(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }


  retailerLogin(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/retailerLogin`, credentials)
      .pipe(tap(tokens => this.storeTokens(tokens)));
  }



}




// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { WebstorgeService } from './web-storage.service';

// @Injectable({
//   providedIn: 'root'
// })

// export class AuthService {

//   url: string;
//   isAuthenticated = false;

//   constructor(
//     private router: Router,
//     public http: HttpClient,
//     private webstorgeService: WebstorgeService,
//   ) {

//     this.url = `api/login`
//   }

//   isLoggedIn(): boolean {    
//     return !!localStorage.getItem('token');   
//   }  

//   logout(): void {
//     localStorage.removeItem('token');
//     this.isAuthenticated = false;
//     this.router.navigate(['/login']);
//   }
// }

