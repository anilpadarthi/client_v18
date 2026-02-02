import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.models';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  url: string;

  constructor(public http: HttpClient, private router: Router, private zone: NgZone) {
    this.url = `api/auth`
    this.isLoggedIn$.next(this.isAuthenticated());
  }

  /** 🔹 Login and store tokens */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, credentials);
  }

  // ✅ STORE TOKENS
  storeTokens(tokens: AuthResponse) {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);

    this.isLoggedIn$.next(true);
  }

  // ✅ GET ACCESS TOKEN
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  // ✅ GET REFRESH TOKEN
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // ✅ REFRESH TOKEN API CALL
  refreshAccessToken(): Observable<any> {
    return this.http.post(`${this.url}/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.accessTokenKey, res.accessToken);
      })
    );
  }

  // ✅ LOGOUT
  logout() {
    localStorage.clear();
    this.isLoggedIn$.next(false);
    this.http.post<AuthResponse>(`${this.url}/logout`, { refreshToken: this.getRefreshToken() }).subscribe({
    });
    window.location.href = "/login";
  }

  // ✅ CHECK AUTH
  isAuthenticated(): boolean {
    const token = this.getAccessToken();

    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      const expiry = decoded.exp * 1000; // exp is in seconds → convert to ms
      // ✅ Token expired
      // if (Date.now() > expiry) {
      //   return false;
      // }

      // ✅ Token still valid
      return true;

    } catch (error) {

      console.log("Invalid token");
      return false;
    }
  }

  retailerLogin(credentials: LoginRequest): Observable<any> {
    return this.http.post<AuthResponse>(`${this.url}/retailerLogin`, credentials);
  }

  getUserFromToken() {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token as string);
      return {
        userId: decoded.userId,
        userDetails: decoded.userDetails,
      }
    }
    catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

}
