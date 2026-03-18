import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster.service';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toaster: ToasterService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.toaster.showMessage('Unexpected server error.');
        }
        else if (error.status === 400) {
          this.toaster.showMessage('Bad request.');
        }       
        else if (error.status === 403) {
          this.toaster.showMessage('Forbidden.');
        }


        return throwError(() => error);
      })
    );
  }
}
