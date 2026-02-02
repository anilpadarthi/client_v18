/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root',
})
export class WebstorgeService {

    constructor(private router: Router, private authService: AuthService) { }

    public getUserInfo() {
        const tokenData = this.authService.getUserFromToken();
        if (!tokenData || !tokenData.userDetails) {
            return null;
        }
        const userInfo = tokenData.userDetails;
        return JSON.parse(userInfo);
    }

    public getUserRole() {
        const tokenData = this.authService.getUserFromToken();
        if (!tokenData || !tokenData.userDetails) return '';
        const userInfo = tokenData.userDetails;
        const userDetails = JSON.parse(userInfo);
        return userDetails?.userRole?.RoleName || '';
    }

    
    public clearAll() {
        localStorage.clear();
    }

    public logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
