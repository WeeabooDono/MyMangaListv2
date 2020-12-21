/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';
import { User } from '../admin/users/user.model';

const BACKEND_URL = `${environment.apiUrl}/auth`;
const SEPARATOR = ',';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private token!: string;
  private user!: User | null;
  private isAuthenticated = false;
  private isAdmin = false;
  private tokenTimer!: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthUser(): User {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.user!;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(authData: AuthData): void {
    this.http
      .post<{ message: string; user: unknown }>(
        `${BACKEND_URL}/signup`,
        authData
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string): void {
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        user: User;
      }>(`${BACKEND_URL}/login`, { email, password })
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            // token info
            const expiresIn = response.expiresIn;
            this.setAuthTimer(expiresIn);

            // set datas
            this.isAuthenticated = true;
            this.user = response.user;
            if (this.user.roles.includes('ADMIN')) this.isAdmin = true;

            // notify and manually create token expiration
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);

            // save datas
            this.saveAuthData(token, expirationDate, this.user);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout(): void {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.isAdmin = false;
    this.user = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const user = JSON.parse(localStorage.getItem('user')!);
    const expiration = localStorage.getItem('expiration');
    if (!token || !expiration) {
      return;
    }
    return { token, expiration: new Date(expiration), user };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) return;

    const now = new Date();
    const expiresIn = authInformation.expiration.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.user = authInformation.user!;
      if (this.user?.roles.includes('ADMIN')) this.isAdmin = true;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
  }
}
