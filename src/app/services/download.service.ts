import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DownloadService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Download`
  }

  downloadInstantActivationList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadInstantActivationList', requestBody);
  }
  
  downloadDailyActivationList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadDailyActivationList', requestBody);
  }

  downloadCommissionStatementList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadCommissionStatementList', requestBody);
  }

  downloadVatCommissionStatementList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadVatCommissionStatementList', requestBody);
  }


}
