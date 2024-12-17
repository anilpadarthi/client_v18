import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Dashboard`
  }

  getDahboardChartActivationMetrics(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetDahboardChartActivationMetrics', requestBody);
  }

  getDahboardMetrics(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetDahboardMetrics', requestBody);
  }

  getUserWiseActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetUserWiseActivations', requestBody);
  }

  getUserWiseKPIReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetUserWiseKPIReport', requestBody);
  }

  getSimAllocationReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSimAllocationReport', requestBody);
  }

  getNetworkWiseActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetNetworkWiseActivations', requestBody);
  }

  getAreaWiseActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetAreaWiseActivations', requestBody);
  }
  
  
}
