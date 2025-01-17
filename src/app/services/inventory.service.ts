import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Supplier`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }
  
  getArea(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + '/' + id);
  }

  createArea(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url, requestBody);
  }

  updateArea(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url, requestBody);
  }

  deleteArea(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + "/UpdateStatus",requestBody);
  }
}
