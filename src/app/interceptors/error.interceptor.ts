import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster.service';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toaster: ToasterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.error?.message) {
          this.toaster.showMessage(error.error.message);
        } else {
          this.toaster.showMessage('Unexpected server error.');
        }

        return throwError(() => error);
      })
    );
  }
}
