import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportService } from './export.service';

@Injectable({
  providedIn: "root",
})
export class OrderService {

  url: string;

  constructor(public http: HttpClient, public exportService: ExportService) {
    this.url = `api/Order`
  }

  getShoppingPageDetails(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetShoppingPageDetails`);
  }

  getProductList(categoryId: number, subCategoryId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/GetProductList?categoryId=` + categoryId + '&subCategoryId=' + subCategoryId);
  }

  loadNewArrivals(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetNewArrivals`);
  }


  getPagedOrderList(requestBody: any): Observable<any> {
    return this.http.post<any>(`${this.url}/GetPagedOrderList`, requestBody);
  }

  getById(id: number): Observable<any> {
    return this.http.get<Response>(this.url + "/GetById/" + id);
  }

  create(orderDetails: any): Observable<any> {
    return this.http.post<Response>(this.url + "/Create", orderDetails);
  }

  update(orderDetails: any): Observable<any> {
    return this.http.post<Response>(this.url + "/Update", orderDetails);
  }

  updateStatus(orderDetails: any): Observable<any> {
    return this.http.post<Response>(this.url + "/UpdateStatus", orderDetails);
  }

  updateOrderDetails(orderDetails: any): Observable<any> {
    return this.http.post<Response>(this.url + "/UpdateOrderDetails", orderDetails);
  }

  delete(category: any): Observable<any> {
    return this.http.post<Response>(this.url + "/UpdateStatus", category);
  }

  getOrderHistory(orderId: number): Observable<any> {
    return this.http.get<any>(this.url + "/GetOrderHistory/" + orderId);
  }

  hideOrder(orderId: number, isHide: any): Observable<any> {
    return this.http.get<any>(this.url + "/HideOrder?orderId=" + orderId + '&isHide=' + isHide);
  }

  downloadOrdersPDF(invoiceNo: any): Observable<any> {
    return this.http.get<any>(this.url + "/GeneratePdfInvoice?orderId=" + invoiceNo);
  }

  getOrderNotificationCount(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetOrderNotificationCount`);
  }


  getPayment(id: number): Observable<any> {
    return this.http.get<Response>(this.url + "/GetPayment/" + id);
  }
  getOrderPaymentHistory(orderId: number): Observable<any> {
    return this.http.get<any>(this.url + "/GetOrderPaymentHistory/" + orderId);
  }
  createPayment(orderDetails: any): Observable<any> {
    return this.http.post<Response>(this.url + "/CreatePayment", orderDetails);
  }

  updatePayment(orderPaymentId: any): Observable<any> {
    return this.http.get<Response>(this.url + "/UpdateOrderPayment/" + orderPaymentId);
  }

  deletePayment(orderPaymentId: any): Observable<any> {
    return this.http.get<Response>(this.url + "/DeleteOrderPayment/" + orderPaymentId);
  }

  downloadVATInvoice(orderId: number): void {
    let url = this.url + '/GeneratePdfInvoice?orderId=' + orderId + '&isVAT=true';
    return this.exportService.downloadPDF(url, 'Invoice_' + orderId + '.pdf');
  }

  downloadNonVATInvoice(orderId: number): void {
    let url = this.url + '/GeneratePdfInvoice?orderId=' + orderId + '&isVAT=false';
    return this.exportService.downloadPDF(url, 'Invoice_' + orderId + '.pdf');
  }

  sendInvoice(orderId: number, isVAT: boolean): Observable<any> {
    return this.http.get<Response>(this.url + `/SendInvoice?orderId=${orderId}&isVAT=${isVAT}`);
  }

  loadOutstandingMetrics(requestBody: any): Observable<any> {
    return this.http.get<Response>(this.url + `/LoadOutstandingMetrics?filterType=${requestBody.filterType}&filterId=${requestBody.filterId}`);
  }

  downloadOrders(requestBody: any): void {
    let url = this.url + '/DownloadOrders';
    return this.exportService.exportToExcel(url, requestBody, 'SalesList');
  }

}
