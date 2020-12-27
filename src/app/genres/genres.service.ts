import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Genre } from './genre.model';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

const BACKEND_URL = `${environment.apiUrl}/genres`;

@Injectable({ providedIn: 'root' })
export class GenresService {
  private genres: Genre[] = [];
  private genreUpdated = new Subject<{ genres: Genre[] }>();

  constructor(private http: HttpClient) {}

  getGenreUpdateListener(): Observable<{ genres: Genre[] }> {
    return this.genreUpdated;
  }

  getGenres(): Genre[] {
    this.http
      .get<{ message: string; genres: Genre[] }>(`${BACKEND_URL}`)
      .subscribe((data) => {
        this.genres = data.genres;
        this.genreUpdated.next({
          genres: [...this.genres],
        });
      });
    return [...this.genres];
  }
}
