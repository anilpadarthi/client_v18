import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICommonResponse } from '../models/common-response';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  url: string;

  constructor(public http: HttpClient) {
    this.url = `api/login`
  }

  userLogin(requestBody: any): Observable<any> {
    return this.http.post<any>(this.url+'/ValidateUser'+ `?email=${requestBody.email}&password=${requestBody.password}`, {});
  }

 

}
