import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class CommissionStatementService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/CommissionStatement`
  }

  getCommissionList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetCommissionList', requestBody);
  }

  getCommissionStatementReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetCommissionStatementReport', requestBody);
  }

  getCommissionStatementVATReportAsync(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetCommissionStatementVATReportAsync', requestBody);
  }


}
