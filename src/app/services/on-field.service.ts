import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
    providedIn: 'root'
})

export class OnFieldService {

    url: string;

    constructor(public http: HttpClient) {
        this.url = `api/OnField`
    }

    onFieldActivationList(requestBody: any): Observable<any> {
        return this.http.post<ICommonResponse>(this.url + '/OnFieldActivationList', requestBody);
    }

    onFieldCommissionList(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/OnFieldCommissionList', requestBody);
    }

    onFieldGivenVSActivationList(requestBody: any): Observable<ICommonResponse> {
        return this.http.post<ICommonResponse>(this.url + '/OnFieldGivenVSActivationList', requestBody);
    }

    onFieildCommissionWalletAmounts(shopId: number): Observable<ICommonResponse> {
        return this.http.get<ICommonResponse>(this.url + '/OnFieildCommissionWalletAmounts/?shopId='+shopId);
    }

    onFieldCommissionWalletHistory(requestBody:any): Observable<ICommonResponse> {
        let params = new HttpParams()
        .set('shopId', requestBody.shopId.toString())
        .set('walletType', requestBody.walletType);
        
        return this.http.get<ICommonResponse>(this.url + '/OnFieldCommissionWalletHistory', { params })
    }

    onFieldShopVisitHistory(shopId: number): Observable<ICommonResponse> {
        return this.http.get<ICommonResponse>(this.url + '/OnFieldShopVisitHistory/?shopId='+shopId);
    }

}
