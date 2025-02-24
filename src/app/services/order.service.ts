import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class OrderService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/Order`
  }

  getShoppingPageDetails(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetShoppingPageDetails`);
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

  updateStatus(orderDetails: any): Observable<Response> {
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

  

  downloadOrders(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url + "/DownloadOrders", requestBody);
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
    return this.http.get<Response>(this.url + "/UpdateOrderPayment/"+ orderPaymentId);
  }

  deletePayment(orderPaymentId: any): Observable<any> {
    return this.http.get<Response>(this.url + "/DeleteOrderPayment/"+ orderPaymentId);
  }

}
