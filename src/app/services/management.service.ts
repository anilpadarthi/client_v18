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

    salaryInAdvance(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/SalaryInAdvance', requestBody);
    }

    getUserSalaryTransaction(id: number): Observable<ICommonResponse> {
        return this.http.get<ICommonResponse>(this.url + `/GetUserSalaryTransaction?userSalaryTransactionID=${id}`);
    }

    createUserSalaryTransaction(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/CreateUserSalaryTransaction', requestBody);
    }

    updateUserSalaryTransaction(requestBody: any): Observable<ICommonResponse> {
        return this.http.put<ICommonResponse>(this.url + '/UpdateUserSalaryTransaction', requestBody);
    }

    deleteUserSalaryTransaction(id: any): Observable<ICommonResponse> {
        return this.http.delete<ICommonResponse>(this.url + `/DeleteUserSalaryTransaction?userSalaryTransactionID=${id}`);
    }



}
