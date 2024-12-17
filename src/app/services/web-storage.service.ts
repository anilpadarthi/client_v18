/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root',
})
export class WebstorgeService {

    constructor(private router: Router) { }

    public setSession(key: string) {
        localStorage.setItem('token', key);
    }

    public getSession() {
        return localStorage.getItem('token');
    }

    public setUserInfo(user: any) {
        localStorage.setItem('userSession', JSON.stringify(user));
    }

    public getUserInfo() {
        const userInfo: string | null = localStorage.getItem('userSession');
        if (userInfo)
            return JSON.parse(userInfo);
        else
            this.router.navigate(['']);
    }

    public getUserRole() {
        const userInfo: string | null = localStorage.getItem('userSession');
        if (userInfo) {
            var userDetails = JSON.parse(userInfo);
            return userDetails.userRole.roleName;
        }
        return '';
    }

    public setItem(item: any, data: any) {
        localStorage.setItem(item, JSON.stringify(data));
    }

    public getItem(item: any) {
        const data: any = localStorage.getItem(item);
        const parsedData = JSON.parse(data);
        return parsedData;
    }

    public logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
