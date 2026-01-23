import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.models';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private loggedIn$ = new BehaviorSubject<boolean>(this.hasValidTokens());
  url: string;

  constructor(public http: HttpClient, private router: Router, private zone: NgZone) {
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
    localStorage.clear();
    this.zone.run(() => {
      this.router.navigate(['/login']);
    });
    // localStorage.removeItem(this.accessTokenKey);
    // localStorage.removeItem(this.refreshTokenKey);
    // localStorage.removeItem('userDetailsInfo');
    // this.loggedIn$.next(false);
  }

  /** 🔹 Access token helpers */
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  /** 🔹 Store tokens */
  public storeTokens(response: AuthResponse) {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem('userDetailsInfo', JSON.stringify(response.userDetails));
    this.loggedIn$.next(true);
  }

  /** 🔹 Token validation (optional simple check) */
  hasValidTokens(): boolean {
    const token = this.getAccessToken();
    return !!(token && !this.isTokenExpired(token));
  }

  /** 🔹 Check if token is expired */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return exp * 1000 < Date.now();
    } catch (e) {
      return true; // If can't decode, consider expired
    }
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  retailerLogin(credentials: LoginRequest): Observable<any> {
    return this.http.post<AuthResponse>(`${this.url}/retailerLogin`, credentials);
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

