import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Bookmark } from './bookmark.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/bookmarks`;

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private bookmarks: Bookmark[] = [];
  private bookmarksUpdated = new Subject<{ bookmarks: Bookmark[] }>();

  constructor(private http: HttpClient) {}

  getBookmarkUpdateListener(): Observable<{ bookmarks: Bookmark[] }> {
    return this.bookmarksUpdated.asObservable();
  }

  getBookmarks(user_id: number): Bookmark[] {
    this.http
      .get<{ message: string; bookmarks: Bookmark[] }>(
        `${BACKEND_URL}/user/${user_id}`,
      )
      .subscribe((data) => {
        this.bookmarks = data.bookmarks;
        this.bookmarksUpdated.next({
          bookmarks: [...this.bookmarks],
        });
      });
    return [...this.bookmarks];
  }

  getBookmark(
    user_id: number,
    manga_id: number,
  ): Observable<{ bookmark: Bookmark }> {
    console.log('test');
    return this.http.get<{ message: string; bookmark: Bookmark }>(
      `${BACKEND_URL}/${user_id}/${manga_id}`,
    );
  }
}
