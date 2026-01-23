import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (!req.url.startsWith('https://postcodes.io') && !req.url.startsWith('https://api.getAddress.io')) {

      req = req.clone({
        url: `${environment.backend.host}/${req.url}`
      });

       const accessToken = this.authService.getAccessToken();
      if (accessToken) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
            Accept: req.url.includes('Pdf')
              ? 'application/pdf'
              : 'application/json',
          },
        });

        if (req.url.includes('Pdf')) {
          req = req.clone({
            responseType: 'blob',
          });
        }
      } else {
        this.router.navigate(['/signin']);
      }
    }
    
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),

      catchError((error: HttpErrorResponse) => {
        const started = Date.now();
        const elapsed = Date.now() - started;
       
        //this.spinner.hide();
        if (error.status == 401) {
          this.router.navigate(['/signin']);
        } else {
          //   this.snackBar.open(error.message, '×', {
          //     panelClass: 'error',
          //     verticalPosition: 'top',
          //     duration: 3000,
          //   });
        }
        return throwError(error);
      })
    );
  }
}
