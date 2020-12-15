import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Bookmark } from './bookmark.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/bookmarks`;

@Injectable({providedIn: 'root'})
export class BookmarksService {
    
    private bookmarks: Bookmark[] = [];
    private bookmarksUpdated = new Subject<{ bookmarks: Bookmark[] }>();

    constructor(private http: HttpClient) { }

    getBookmarkUpdateListener(){
        return this.bookmarksUpdated.asObservable();
    }

    getBookmarks(user_id: number) {
        this.http
            .get<{message: string, bookmarks: Bookmark[]}>(`${BACKEND_URL}/user/${user_id}`)
            .subscribe((data) => {
                this.bookmarks = data.bookmarks;
                this.bookmarksUpdated.next({ 
                    bookmarks: [...this.bookmarks]
                });
            });
        return [...this.bookmarks];
    }

    getbookmarksfromloggedUser() {
        this.http
            .get<{message: string, bookmarks: Bookmark[]}>(`${BACKEND_URL}/user`)
            .subscribe((data) => {
                this.bookmarks = data.bookmarks;
                this.bookmarksUpdated.next({ 
                    bookmarks: [...this.bookmarks]
                });
            });
        return [...this.bookmarks];
    }

}