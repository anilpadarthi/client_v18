import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  url: string;

  constructor(private http: HttpClient) {
     this.url = `api/PasswordReset`
  }

  forgotPassword(email: string, mode: string): Observable<any> {
    return this.http.post(
      `${this.url}/forgot-password`,
      { email, mode }
    );
  }

  verifyResetToken(token: string): Observable<any> {
    return this.http.post(
      `${this.url}/verify`,
      { token }
    );
  }

  resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {

    return this.http.post(
      `${this.url}/reset-password`,
      data
    );
  }
}