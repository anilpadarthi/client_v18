import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WebstorgeService } from './web-storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  url: string;
  isAuthenticated = false;

  constructor(
    private router: Router,
    public http: HttpClient,
    private webstorgeService: WebstorgeService,
  ) {

    this.url = `api/login`
  }

  isLoggedIn(): boolean {    
    return !!localStorage.getItem('token');   
  }  

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}