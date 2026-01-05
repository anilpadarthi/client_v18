import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';
import { ExportService } from './export.service';

@Injectable({
    providedIn: 'root',
})
export class BulkUploadService {
    url: string;
    constructor(private http: HttpClient, private exportService: ExportService) {
        this.url = `api/BulkUpload`
    }

    uploadFile(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/Import', requestBody);
    }

    downloadTargetFile(requestBody: any): void {
        return this.exportService.exportToExcel(this.url + '/DownloadTargetData', requestBody, 'KPI_Targets');
    }
}
