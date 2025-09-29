import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  url: string;

  constructor(public http: HttpClient, public exportService: ExportService) {
    this.url = `api/User`
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  getUser(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  createUser(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Create', requestBody);
  }

  updateUser(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Update', requestBody);
  }

  deleteUser(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/Delete?id=${id}`);
  }

  getAllAgentsToAllocate(): Observable<any> {
    return this.http.post<any>(this.url + '/GetAllAgentsToAllocate', null);
  }

  allocateAgentsToManager(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/AllocateAgentsToManager', requestBody);
  }

  exportToExcel(): void {
    let url = this.url + '/ExportToExcel';
    return this.exportService.downloadExcel(url, 'AreaList');
  }

  viewUserAllocationHistory(userId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/ViewUserAllocationHistory?userId=${userId}`);
  }

  updateAddress(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<any>(this.url + '/UpdateAddress' + `?shippingAddress=${requestBody.shippingAddress}`, {});
  }

  sendActivationEmail(userId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/SendActivationEmail?userId=${userId}`);
  }

  changePassword(payload: { oldPassword: string; newPassword: string }): Observable<ICommonResponse> {
    return this.http.post<any>(`${this.url}/change-password`, payload);
  }

}
