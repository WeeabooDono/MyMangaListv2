import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

const BACKEND_URL = `${environment.apiUrl}/users`;

@Injectable({ providedIn: 'root' })
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[] }>();

  constructor(private http: HttpClient) {}

  getUserUpdateListener(): Observable<{ users: User[] }> {
    return this.usersUpdated.asObservable();
  }

  getUsers(): User[] {
    this.http
      .get<{ message: string; users: User[] }>(`${BACKEND_URL}`)
      .subscribe((data) => {
        this.users = data.users;
        this.usersUpdated.next({
          users: [...this.users],
        });
      });
    return [...this.users];
  }

  getUser(id: number): Observable<{ user: User; message: string }> {
    return this.http.get<{ user: User; message: string }>(
      `${BACKEND_URL}/${id}`,
    );
  }

  getUserByUsername(
    username: string,
  ): Observable<{ user: User; message: string }> {
    return this.http.get<{ user: User; message: string }>(
      `${BACKEND_URL}/username/${username}`,
    );
  }

  deleteUser(id: number): Observable<{ data: any; message: string }> {
    return this.http.delete<{ data: any; message: string }>(
      `${BACKEND_URL}/${id}`,
    );
  }

  uploadProfileImage(user: User): Observable<{ user: User; message: string }> {
    let userData: User | FormData;

    if (typeof user.image === 'object') {
      userData = new FormData();
      userData.append('username', user.username);
      userData.append('status', user.status);
      userData.append('email', user.email);
      userData.append('image', user.image, user.username);
      console.log(userData);
    } else userData = user;

    return this.http.patch<{ user: User; message: string }>(
      `${BACKEND_URL}/${user.id}`,
      userData,
    );
  }
}
