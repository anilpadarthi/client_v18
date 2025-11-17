import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RetailerService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Retailer`
  }


  getActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetActvations', requestBody);
  }

  getSimGiven(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSimGiven', requestBody);
  }

  getRetailerCommissionList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetRetailerCommissionList', requestBody);
  }

  getStockVsConnections(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetStockVsConnections', requestBody);
  }


}
