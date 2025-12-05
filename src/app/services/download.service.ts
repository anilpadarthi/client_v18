import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class DownloadService {

  url: string;

  constructor(public http: HttpClient,  public exportService: ExportService) {
    this.url = `api/Download`
  }

  downloadInstantActivationList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadInstantActivationList', requestBody);
  }
  
  downloadDailyActivationList(requestBody: any): void {
    let url = this.url + '/DownloadDailyActivationList';
    return this.exportService.exportToExcel(url, requestBody, 'DailyActivationList');
  }

   downloadActivtionAnalysisReport(requestBody: any): void {
    let url = this.url + '/DownloadActivtionAnalysisReport';
    return this.exportService.exportToExcel(url, requestBody, 'ActivationAnalysisReport');
  }

  downloadCommissionStatementList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadCommissionStatementList', requestBody);
  }

  downloadVatCommissionStatementList(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DownloadVatCommissionStatementList', requestBody);
  }


}
