import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    let cloned = req;

    if (token) {
      cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(cloned).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap(tokens => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(tokens.accessToken);
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
                });
                return next.handle(newReq);
              }),
              catchError(refreshErr => {
                this.isRefreshing = false;
                this.authService.logout();
                return throwError(() => refreshErr);
              })
            );
          } else {
            // wait for refreshTokenSubject to emit
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(token => {
                const newReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next.handle(newReq);
              })
            );
          }
        }

        return throwError(() => err);
      })
    );
  }
}
