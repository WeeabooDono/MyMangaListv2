import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Bookmark } from './bookmark.model';
import { User } from './user.model';

@Injectable({providedIn: 'root'})
export class UsersService {
    
    private users: User[] = [];
    private usersUpdated = new Subject<{ users: User[], userCount: number }>();

    constructor(private http: HttpClient, private router: Router) { }

    getUsersUpdateListener(){
        return this.usersUpdated.asObservable();
    }

    getUsers() {
        this.http
            .get<{message: string, users: any, count: number}>('http://localhost:9000/api/users')
            .pipe(map((data) => {
                return { 
                    users: data.users.map( (user: { 
                        _id: string;
                        username: string;
                        email: string;
                        roles: string[];
                        status: string;
                        bookmarks: Bookmark[];
                        }) => {
                            return {
                                username: user.username,
                                email: user.email,
                                roles: user.roles,
                                status: user.status,
                                id: user._id,
                                bookmarks: user.bookmarks,
                            }
                        }),
                    count: data.count
                }
            }))
            .subscribe((data) => {
                this.users = data.users;
                this.usersUpdated.next({ 
                    users: [...this.users], 
                    userCount: data.count
                });
            });
        return [...this.users];
    }

    getUser(id: string) {
        return this.http.get<{ _id: string, username: string, email: string, roles: string, status: string, bookmarks: Bookmark[] }>('http://localhost:9000/api/users/' + id);
    }
}