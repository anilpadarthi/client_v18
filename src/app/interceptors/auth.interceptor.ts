import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getAccessToken();
    const isRefreshReq = this.isRefreshRequest(req);
    let authReq = req;

    // Do not attach expired access token to refresh request
    if (token && !isRefreshReq) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Don't attempt refresh or logout for authentication endpoints (login, retailerLogin)
          const isAuthEndpoint = req.url.includes('/login') || req.url.includes('/retailerLogin');
          if (isAuthEndpoint) {
            return throwError(() => error);
          }
          // If the 401 happened while trying to refresh, logout (avoid loop)
          if (isRefreshReq) {
            this.authService.logout();
            return throwError(() => error);
          }
          // Handle refresh with queueing to avoid multiple refresh calls
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isRefreshRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/refresh');
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          const newToken = this.authService.getAccessToken();
          this.refreshTokenSubject.next(newToken);

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next.handle(retryReq);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }
    else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((token) => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(retryReq);
        })
      );
    }
  }
}
