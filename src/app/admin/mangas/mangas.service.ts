import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Manga } from './manga.model';
import { environment } from '../../../environments/environment';
import { Bookmark } from '../../bookmarks/bookmark.model';

const BACKEND_URL = `${environment.apiUrl}/mangas`;
@Injectable({ providedIn: 'root' })
export class MangasService {
  private mangas: Manga[] = [];
  private mangasUpdated = new Subject<{
    mangas: Manga[];
    mangaCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getMangasUpdateListener(): Observable<{
    mangas: Manga[];
    mangaCount: number;
  }> {
    return this.mangasUpdated.asObservable();
  }

  getMangas(page: number, pagesize: number): Manga[] {
    const queryParams = `?page=${page}&pagesize=${pagesize}`;
    this.http
      .get<{ message: string; mangas: any; count: number }>(
        `${BACKEND_URL}/${queryParams}`,
      )
      .subscribe((data) => {
        this.mangas = data.mangas;
        this.mangasUpdated.next({
          mangas: [...this.mangas],
          mangaCount: data.count,
        });
      });
    return [...this.mangas];
  }

  getMangasList(): Manga[] {
    this.http
      .get<{ message: string; mangas: any; count: number }>(`${BACKEND_URL}`)
      .subscribe((data) => {
        this.mangas = data.mangas;
        this.mangasUpdated.next({
          mangas: [...this.mangas],
          mangaCount: data.count,
        });
      });
    return [...this.mangas];
  }

  getManga(id: number): Observable<{ manga: Manga; message: string }> {
    return this.http.get<{ manga: Manga; message: string }>(
      `${BACKEND_URL}/${id}`,
    );
  }

  addManga(manga: Manga): void {
    const mangaData = new FormData();
    mangaData.append('title', manga.title);
    mangaData.append('author', manga.author);
    mangaData.append('description', manga.description);
    mangaData.append('image', manga.image, manga.title);
    this.http
      .post<{ message: string; manga: Manga }>(`${BACKEND_URL}/`, mangaData)
      .subscribe((response) => {
        this.router.navigate(['/admin/mangas']);
      });
  }

  deleteManga(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}/${id}`);
  }

  updateManga(manga: Manga): void {
    let mangaData: Manga | FormData;
    if (typeof manga.image === 'object') {
      mangaData = new FormData();
      mangaData.append('title', manga.title);
      mangaData.append('author', manga.author);
      mangaData.append('description', manga.description);
      mangaData.append('image', manga.image, manga.title);
      mangaData.append('genres', manga.genres.toString());
    } else mangaData = manga;

    this.http
      .patch<{ message: string; manga: Manga }>(
        `${BACKEND_URL}/${manga.id}`,
        mangaData,
      )
      .subscribe((response) => {
        this.router.navigate(['/admin/mangas']);
      });
  }

  bookmarkManga(
    id: number,
  ): Observable<{ bookmark: Bookmark; message: string }> {
    return this.http.post<{ bookmark: Bookmark; message: string }>(
      `${BACKEND_URL}/bookmark`,
      { id },
    );
  }

  unbookmarkManga(
    id: number,
  ): Observable<{ bookmark: Bookmark; message: string }> {
    return this.http.delete<{ bookmark: Bookmark; message: string }>(
      `${BACKEND_URL}/bookmark/${id}`,
    );
  }
}
