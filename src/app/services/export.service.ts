import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ToasterService } from './toaster.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExportService {

    constructor(private http: HttpClient, public toasterService: ToasterService) { }

    downloadExcel(apiUrl: any, fileName: any): void {
        this.http
            .get(apiUrl, { responseType: 'blob' })
            .subscribe((response) => {
                const blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                saveAs(blob, `${fileName}.xlsx`);
            });
    }

    downloadPDF(apiUrl: any, fileName: any): void {
        this.http
            .get(apiUrl, { responseType: 'blob' })
            .subscribe((response) => {
                if (response != null) {
                    const blob = new Blob([response], {
                        type: 'application/pdf',
                    });
                    saveAs(blob, fileName);
                }
                else {
                    this.toasterService.showMessage("Something went wrong.")
                }
            });
    }

    downloadToPDF(apiUrl: string, requestBody: any, fileName: string): Observable<boolean> {
        return this.http.post(apiUrl, requestBody, { responseType: 'blob' }).pipe(
          map((response: Blob) => {
            if (response) {
              const blob = new Blob([response], { type: 'application/pdf' });
              saveAs(blob, fileName);
              return true; // Ensure we return a boolean
            }
            return false;
          }),
          catchError((error) => {
            this.toasterService.showMessage('Something went wrong.');
            return of(false); // Ensure the error case also returns a boolean
          })
        );
      }

}
