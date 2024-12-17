import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class ShopService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Shop`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }
  
  getShop(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url  + `/GetById?id=${id}`);
  }

  createShop(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url+ '/Create', requestBody);
  }

  updateShop(requestBody: any): Observable<ICommonResponse> {
    return this.http.put<ICommonResponse>(this.url+ '/Update', requestBody);
  }

  deleteShop(id: number): Observable<ICommonResponse> {
    return this.http.delete<ICommonResponse>(this.url +  `/Delete?id=${id}`);
  }

  creteShopVisit(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url+ '/ShopVisit', requestBody);
  }

  getShopVisitHistory(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url+ `/GetShopVisitHistory?shopId=${shopId}`);
  }

  getShopWalletAmount(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url+ `/GetShopWalletAmount?shopId=${shopId}`);
  }

  getShopWalletHistory(shopId: number,walletType:string): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url+ `/GetShopWalletHistory?shopId=${shopId}&walletType='${walletType}'`);
  }


}
