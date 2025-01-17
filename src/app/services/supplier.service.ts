import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class SupplierService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Supplier`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }
  
  getSupplier(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  createSupplier(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Create', requestBody);
  }

  updateSupplier(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url+ '/Update', requestBody);
  }

  deleteSupplier(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/Delete?id=${id}`);
  }

}
