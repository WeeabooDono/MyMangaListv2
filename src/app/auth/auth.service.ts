import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/auth`;
const SEPARATOR = ',';
@Injectable({ providedIn: 'root' })
export class AuthService {


    private token!: string;
    private isAuthenticated: boolean = false;
    private isAdmin: boolean = false;
    private tokenTimer!: any;
    private authStatusListener = new Subject<boolean>();
    private id!: string;
    private roles!: string[] | undefined ;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getIsAdmin() {
        return this.isAdmin;
    }

    getUserId() {
        return this.id;
    }

    getUserRoles() {
        return this.roles;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(authData: AuthData){
        this.http.post<{ message: string, user: any}>(`${BACKEND_URL}/signup`, authData)
            .subscribe(response => {
                this.router.navigate(['/']);
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    login(email: string, password: string){
        this.http.post<{message: string, token: string, expiresIn: number, id: string, roles: string[] }>(`${BACKEND_URL}/login`
            , { email, password })
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                if(token) {
                    const expiresIn = response.expiresIn;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.id = response.id;
                    this.roles = response.roles;
                    if(this.roles.includes('ADMIN')) this.isAdmin = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
                    this.saveAuthData(token, expirationDate, this.id, this.roles);
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
        this.isAdmin = false;
        this.roles = [];
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private saveAuthData(token: string, expirationDate: Date, id: string, roles: string[]) {
        const string_roles = roles.join(SEPARATOR);
        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
        localStorage.setItem('roles', string_roles);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('roles');
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('expiration');
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const expiration = localStorage.getItem('expiration');
        const roles: string[] | undefined = localStorage.getItem('roles')?.split(SEPARATOR);
        if (!token || !expiration) {
            return;
        }
        return { token, expiration: new Date(expiration), id, roles }
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
            this.roles = authInformation.roles;
            if(this.roles?.includes('ADMIN')) this.isAdmin = true;
            this.setAuthTimer(expiresIn / 1000)
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
        }
    }
}