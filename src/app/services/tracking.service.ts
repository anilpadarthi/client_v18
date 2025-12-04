import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class TrackingService {

  url: string;

  constructor(public http: HttpClient, public exportService: ExportService) {
    this.url = `api/Track`
  }

  getTrackReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetTrackReport', requestBody);
  }
  
  getAreasVisitedReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetAreasVisitedReport', requestBody);
  }
  
  getShopsVisitedReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetShopsVisitedReport', requestBody);
  }
  
  getShopsSimsGivenReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetShopsSimsGivenReport', requestBody);
  }
  
  getUserTrackDataReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetUserTrackDataReport', requestBody);
  }
  
  getDailyGivenReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetDailyGivenReport', requestBody);
  }
  
  getLatLongReport(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetLatLongReport', requestBody);
  }
  
  logUserTrackAsync(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/LogUserTrackAsync', requestBody);
  }
  
  downloadAttendace(date: any): void {
    let url = this.url + '/DownloadAttendace';
    return this.exportService.downloadExcel(url +`?date=${date}`, 'AttendanceReport');
  }
  
}
