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
    private id!: string;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.id;
    }
    

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(authData: AuthData){
        this.http.post<{ message: string, user: any}>('http://localhost:9000/api/auth/signup', authData)
            .subscribe(response => {
                this.router.navigate(['/']);
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    login(email: string, password: string){
        this.http.post<{message: string, token: string, expiresIn: number, id: string}>('http://localhost:9000/api/auth/login'
            , { email, password })
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    const expiresIn = response.expiresIn;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.id = response.id;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate, this.id);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            })
    }

    logout() {
        this.token = '';
        this.id = '';
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, id: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('expiration');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const expiration = localStorage.getItem('expiration');
        if (!token || !expiration) {
            return;
        }
        return { token, expiration: new Date(expiration), id }
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
            this.id = authInformation.id!;
            this.setAuthTimer(expiresIn / 1000)
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
        }
    }
}