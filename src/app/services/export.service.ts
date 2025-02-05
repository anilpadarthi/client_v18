import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class ExportService {

    constructor(private http: HttpClient) { }

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
}
