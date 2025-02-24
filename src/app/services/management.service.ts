import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
    providedIn: 'root',
})
export class ManagementService {
    url: string;
    constructor(private http: HttpClient) {
        this.url = `api/Management`
    }

    CreateWhatsAppNotificationRequest(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/CreateWhatsAppNotificationRequest', requestBody);
    }
}
