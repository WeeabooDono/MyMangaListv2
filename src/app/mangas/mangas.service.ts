import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Manga } from './manga.model';

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
            .get<{message: string, mangas: any, count: number}>('http://localhost:9000/api/mangas' + queryParams)
            .pipe(map((data) => {
                return { 
                    mangas: data.mangas.map( (manga: { 
                        title: string; 
                        description: string; 
                        author: string; 
                        image: string;
                        _id: string; 
                        }) => {
                            return {
                                title: manga.title,
                                description: manga.description,
                                author: manga.author,
                                image: manga.image,
                                id: manga._id
                            }
                        }),
                    count: data.count
                }
            }))
            .subscribe((data) => {
                this.mangas = data.mangas;
                this.mangasUpdated.next({ 
                    mangas: [...this.mangas], 
                    mangaCount: data.count
                });
            });
        return [...this.mangas];
    }

    getManga(id: string) {
        return this.http.get<{ _id: string, title: string, description: string, author: string, image: string }>('http://localhost:9000/api/mangas/' + id);
    }

    addManga(manga: Manga){
        const mangaData = new FormData();
        mangaData.append('title', manga.title);
        mangaData.append('author', manga.author);
        mangaData.append('description', manga.description);
        mangaData.append('image', manga.image, manga.title);
        this.http
            .post<{ message: string, manga: Manga }>('http://localhost:9000/api/mangas', mangaData)
            .subscribe((response) => {
                console.log(response);
                this.router.navigate(["/"]);
            })    
    }

    deleteManga(id: string) {
        return this.http.delete<{ message: string }>('http://localhost:9000/api/mangas/' + id);
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
            .patch<{ message: string, manga: Manga }>('http://localhost:9000/api/mangas/' + manga.id, mangaData)
            .subscribe((response) => {
                this.router.navigate(["/"]);
            })    
    }

    bookmarkManga(id: string){
        this.http
            .post('http://localhost:9000/api/mangas/bookmark', { id })
            .subscribe((response) => {
                console.log(response);
            })
    }
}