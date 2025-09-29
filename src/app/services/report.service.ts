import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Report`
  }

  getLastDailyActivationReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetLastDailyActivationReport', requestBody);
  }

  getSpamReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSpamReport', requestBody);
  }

  getInstantActivationReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetInstantActivationReport', requestBody);
  }

  getAgentInstantActivationReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetAgentInstantActivationReport', requestBody);
  }

  getShopInstantActivationReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetShopInstantActivationReport', requestBody);
  }

  downloadInstantActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadInstantActivations', requestBody);
  }

  getShopWiseReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetShopWiseReport', requestBody);
  }

  getMonthlyActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetMonthlyActivations', requestBody);
  }

  getMonthlyHistoryActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetMonthlyHistoryActivations', requestBody);
  }

  getDailyGivenCount(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetDailyGivenCount', requestBody);
  }

  getNetworkUsageReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetNetworkUsageReport', requestBody);
  }

  getMonthlyAreaActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetMonthlyAreaActivations', requestBody);
  }

  getMonthlyShopActivations(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetMonthlyShopActivations', requestBody);
  }

  getSalaryReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSalaryReport', requestBody);
  }

  getKPITargetReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetKPITargetReport', requestBody);
  }

  getUserReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetUserReport', requestBody);
  }

  getSupplierReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSupplierReport', requestBody);
  }



  getSimAllocationReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSimAllocationReport', requestBody);
  }

  getMonthlyAccessoriesReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetMonthlyAccessoriesReport', requestBody);
  }

  getMonthlyAccessoriesCommissionPercentReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetMonthlyAccessoriesCommissionPercentReport', requestBody);
  }

  getChequeWithdrawnReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetChequeWithdrawnReport', requestBody);
  }

  getBankChequeStatus(chequeNumber: any): Observable<any> {
    return this.http.get<any>(this.url + '/GetBankChequeStatus?chequeNumber=' + chequeNumber);
  }

}
