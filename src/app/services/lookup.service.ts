import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: "root",
})

export class LookupService {
  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/lookup`
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.url + "/Categories");
  }

  getSubCategories(categoryId: number): Observable<any> {
    return this.http.get<any>(this.url +'/'+ categoryId + "/SubCategories");
  }

  getColours(): Observable<any> {
    return this.http.get<any>(this.url + "/Colours");
  }

  getSizes(): Observable<any> {
    return this.http.get<any>(this.url + "/Sizes");
  }

  getConfigurationTypes(): Observable<any> {
    return this.http.get<any>(this.url + "/ConfigurationTypes");
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.url + "/Products");
  }

  getSuppliers(): Observable<any> {
    return this.http.get<any>(this.url + "/Suppliers");
  }

  getSupplierAccounts(supplierId: number): Observable<any> {
    return this.http.get<any>(this.url + "/SupplierAccounts/" + supplierId);
  }

  getOrderStatusTypes(): Observable<any> {
    return this.http.get<any>(this.url + "/OrderStatusTypes");
  }

  getOrderPaymentTypes(): Observable<any> {
    return this.http.get<any>(this.url + "/OrderPaymentTypes");
  }

  getOrderDeliveryTypes(): Observable<any> {
    return this.http.get<any>(this.url + "/OrderDeliveryTypes");
  }

  getAgents(): Observable<any> {
    return this.http.get<any>(this.url + "/Agents");
  }

  getManagers(): Observable<any> {
    return this.http.get<any>(this.url + "/Managers");
  }

  getAreas(): Observable<ICommonResponse> {
    return this.http.get<ICommonResponse>(this.url + "/Areas");
  }

  getShops(areaId: any): Observable<any> {
    return this.http.get<any>(this.url + "/Shops/?areaId=" + areaId);
  }

  getNetowrks(): Observable<any> {
    return this.http.get<any>(this.url + "/Networks");
  }

  getUserRoles(): Observable<any> {
    return this.http.get<any>(this.url + "/Roles");
  }

}
