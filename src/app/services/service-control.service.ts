// service-control.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceControlService {
  private apiUrl = 'https://your-server/api/service'; // change to your backend URL

  constructor(private http: HttpClient) {}

  startService(): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, {});
  }

  stopService(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {});
  }

  getStatus(): Observable<string> {
    return this.http.get(`${this.apiUrl}/status`, { responseType: 'text' });
  }
}
