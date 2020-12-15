import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Manga } from './manga.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/mangas`;
@Injectable({providedIn: 'root'})
export class MangasService {
    
    private mangas: Manga[] = [];
    private mangasUpdated = new Subject<{ mangas: Manga[], mangaCount: number }>();

    constructor(private http: HttpClient, private router: Router) { }

    getMangasUpdateListener(){
        return this.mangasUpdated.asObservable();
    }

    getMangas(page: number, pagesize: number) {
        const queryParams = `?page=${page}&pagesize=${pagesize}`;
        this.http
            .get<{message: string, mangas: any, count: number}>(`${BACKEND_URL}/${queryParams}`)
            .subscribe((data) => {
                this.mangas = data.mangas;
                this.mangasUpdated.next({ 
                    mangas: [...this.mangas], 
                    mangaCount: data.count
                });
            });
        return [...this.mangas];
    }

    getManga(id: Number) {
        return this.http.get<{ manga: Manga, message: string }>(`${BACKEND_URL}/${id}`);
    }

    addManga(manga: Manga){
        const mangaData = new FormData();
        mangaData.append('title', manga.title);
        mangaData.append('author', manga.author);
        mangaData.append('description', manga.description);
        mangaData.append('image', manga.image, manga.title);
        this.http
            .post<{ message: string, manga: Manga }>(`${BACKEND_URL}/`, mangaData)
            .subscribe((response) => {
                this.router.navigate(["/"]);
            })    
    }

    deleteManga(id: Number) {
        return this.http.delete<{ message: string }>(`${BACKEND_URL}/${id}`);
    }

    updateManga(manga: Manga){
        let mangaData: Manga | FormData;
        if (typeof manga.image === 'object'){
            mangaData = new FormData();
            mangaData.append('title', manga.title);
            mangaData.append('author', manga.author);
            mangaData.append('description', manga.description);
            mangaData.append('image', manga.image, manga.title);
        } else mangaData = manga;

        this.http
            .patch<{ message: string, manga: Manga }>(`${BACKEND_URL}/${manga.id}`, mangaData)
            .subscribe((response) => {
                this.router.navigate(["/"]);
            })    
    }

    bookmarkManga(id: Number){
        return this.http.post(`${BACKEND_URL}/bookmark`, { id });
    }

    unbookmarkManga(id: Number){
        return this.http.delete(`${BACKEND_URL}/bookmark/${id}`);
    }
}