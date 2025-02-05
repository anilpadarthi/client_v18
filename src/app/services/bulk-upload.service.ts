import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
    providedIn: 'root',
})
export class BulkUploadService {
    url: string;
    constructor(private http: HttpClient) {
        this.url = `api/BulkUpload`
    }

    uploadFile(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/Import', requestBody);
    }
}
