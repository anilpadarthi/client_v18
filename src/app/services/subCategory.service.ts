import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';


@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/SubCategory`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  getSubCategory(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  createSubCategory(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Create', requestBody);
  }

  updateSubCategory(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Update', requestBody);
  }

  deleteSubCategory(id: any): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/Delete?id=${id}`);
  }
}
