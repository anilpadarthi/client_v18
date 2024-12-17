import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SimService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Sim`
  }

  scanSims(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/ScanSims', requestBody);
  }

  allocateSims(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/AllocateSims', requestBody);
  }

  deAllocateSims(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/DeAllocateSims', requestBody);
  }

  getSimHistoryDetails(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetSimHistoryDetails', requestBody);
  }
  
  
}
