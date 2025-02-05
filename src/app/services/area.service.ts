import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';
import { ExportService } from './export.service';

@Injectable({
  providedIn: 'root'
})

export class AreaService {

  url: string;

  constructor(public http: HttpClient, public exportService: ExportService) {
    this.url = `api/Area`
  }

  getAllAreasToAllocate(): Observable<any> {
    return this.http.post<any>(this.url + '/GetAllAreasToAllocate', null);
  }

  getByPaging(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + '/GetByPaging', requestBody);
  }

  getArea(id: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/GetById?id=${id}`);
  }

  createArea(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Create', requestBody);
  }

  updateArea(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/Update', requestBody);
  }

  deleteArea(id: any): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/Delete?id=${id}`);
  }

  allocateAreasToAgent(requestBody: any): Observable<ICommonResponse> {
    return this.http.post<ICommonResponse>(this.url + '/AllocateAreasToAgent', requestBody);
  }

  exportToExcel(): void {
    let url =  this.url +'/ExportToExcel';
    return this.exportService.downloadExcel(url,'AreaList');
  }

  viewAreaAllocationHistory(areaId: number): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + `/ViewAreaAllocationHistory?areaId=${areaId}`);
  }

}
