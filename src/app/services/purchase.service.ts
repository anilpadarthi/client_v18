import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class PurchaseService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Purchase`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }
  
  get(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  getItems(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetItems?id=${id}`);
  }

  create(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url+ '/Create', requestBody);
  }

  update(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Update', requestBody);
  }

  delete(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + "/UpdateStatus",requestBody);
  }
}
