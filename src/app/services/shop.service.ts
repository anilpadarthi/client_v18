import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class ShopService {

  url: string;

  constructor(public http: HttpClient, public exportService: ExportService) {
    this.url = `api/Shop`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  getShop(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  createShop(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Create', requestBody);
  }

  updateShop(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Update', requestBody);
  }

  deleteShop(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/Delete?id=${id}`);
  }

  creteShopVisit(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/ShopVisit', requestBody);
  }

  getShopVisitHistory(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetShopVisitHistory?shopId=${shopId}`);
  }

  getShopAgreementHistory(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetShopAgreementHistory?shopId=${shopId}`);
  }

  getShopOrderHistory(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetShopAgreementHistory?shopId=${shopId}`);
  }

  getShopWalletAmount(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetShopWalletAmount?shopId=${shopId}`);
  }

  getShopWalletHistory(shopId: number, walletType: string): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetShopWalletHistory?shopId=${shopId}&walletType='${walletType}'`);
  }

  exportToExcel(areaId: number): void {
    let url = this.url + '/ExportToExcel?areaId=' + areaId;
    return this.exportService.downloadExcel(url, 'ShopList');
  }

  getShopAddressDetails(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetShopAddressDetails?shopId=${id}`);
  }

  updateAddress(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<any>(this.url + '/UpdateAddress' + `?shippingAddress=${requestBody.shippingAddress}`, {});
  }

  sendActivationEmail(shopId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/SendActivationEmail?shopId=${shopId}`);
  }

}
