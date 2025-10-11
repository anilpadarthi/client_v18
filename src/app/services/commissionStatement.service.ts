import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class CommissionStatementService {

  url: string;

  constructor(public http: HttpClient, public exportService: ExportService) {
    this.url = `api/CommissionStatement`
  }

  getCommissionList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetCommissionList', requestBody);
  }

  getAreaCommissionList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetAreaCommissionList', requestBody);
  }


  downloadPDFStatementReport(requestBody: any): Observable<boolean> {
    const url = this.url + '/DownloadPDFStatementReport';
    return this.exportService.downloadToPDF(url, requestBody, 'Commission_Statement.pdf');
  }

  getCommissionStatementVATReportAsync(requestBody: any): Observable<boolean> {
    const url = this.url + '/GetCommissionStatementVATReportAsync';
    return this.exportService.downloadToPDF(url, requestBody, 'Commission_VAT_Statement.pdf');
  }


  getCommissionHistoryDetails(shopCommissionHistoryId: number): Observable<any> {
    return this.http.get<any>(this.url + `/GetCommissionHistoryDetails?shopCommissionHistoryId=${shopCommissionHistoryId}`);
  }

  optInForShopCommission(shopCommissionHistoryId: number, optInType: string): Observable<any> {
    return this.http.get<any>(this.url + `/OptInForShopCommission?shopCommissionHistoryId=${shopCommissionHistoryId} &optInType=${optInType}`);
  }

  downloadCommissionStatement(shopId: number, fromDate: string): void {
    let url = this.url + '/downloadCommissionStatement?shopId=' + shopId + '&fromDate=' + fromDate;
    return this.exportService.downloadPDF(url, 'Commission_Statement_' + shopId + '.pdf');
  }

  exportCommissionChequeExcel(filterMode: any, fromDate: any): void {
    let url = this.url + '/ExportCommissionChequeExcel?filterMode=' + filterMode + '&fromDate=' + fromDate;
    return this.exportService.downloadExcel(url, 'Commission_List');
  }

  hideBonus(shopCommissionHistoryId: number, isDisplayBonus: any): Observable<any> {
    return this.http.get<any>(this.url + "/HideBonus?shopCommissionHistoryId=" + shopCommissionHistoryId + '&isDisplayBonus=' + isDisplayBonus);
  }
}
