import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class NetworkService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Network`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }
  
  getNetwork(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  createNetwork(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Create', requestBody);
  }

  updateNetwork(requestBody: any): Observable<ICommonResponse> {
    return this.http.put<ICommonResponse>(this.url + '/Update', requestBody);
  }

  deleteNetwork(id: number): Observable<ICommonResponse> {
    return this.http.delete<ICommonResponse>(this.url +  `/Delete?id=${id}`);
  }
}
