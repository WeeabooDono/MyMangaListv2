import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private token!: string;
    private isAuthenticated: boolean = false;
    private tokenTimer!: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(authData: AuthData){
        this.http.post<{ message: string, user: any}>('http://localhost:9000/api/auth/signup', authData)
            .subscribe(response => {
                console.log(response)
            })
    }

    login(email: string, password: string){
        this.http.post<{message: string, token: string, expiresIn: number}>('http://localhost:9000/api/auth/login'
            , { email, password })
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    const expiresIn = response.expiresIn;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate);
                    this.router.navigate(['/']);
                }
            })
    }

    logout() {
        this.token = '';
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expiration = localStorage.getItem('expiration');
        if (!token || !expiration) {
            return;
        }
        return { token, expiration: new Date(expiration) }
    }

    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
                        this.logout();
                    }, duration * 1000)
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation ) return;

        const now = new Date();
        const expiresIn = authInformation.expiration.getTime() - now.getTime();
        if (expiresIn > 0){
            this.token = authInformation.token;
            this.setAuthTimer(expiresIn / 1000)
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
        }
    }
}