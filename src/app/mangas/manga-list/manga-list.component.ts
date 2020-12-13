import { Component, OnDestroy, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Manga } from '../manga.model'
import { MangasService } from '../mangas.service';

@Component({
  selector: 'app-manga-list',
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.css']
})
export class MangaListComponent implements OnInit, OnDestroy {

  authenticated = false;
  id!:string;
  private authListenerSub!: Subscription;

  mangas: Manga[] = [];
  private mangasSub: Subscription = new Subscription;

  isLoading = false;

  // pagination attributes
  length = 0;
  pageSize = 10;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public mangasService: MangasService, private authService: AuthService) { }

  ngOnDestroy(): void {
    this.mangasSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
    this.id = this.authService.getUserId();
    this.mangasSub = this.mangasService.getMangasUpdateListener()
      .subscribe((mangaData: { mangas: Manga[], mangaCount: number }) => {
        this.isLoading = false;
        this.mangas = mangaData.mangas;
        this.length = mangaData.mangaCount;
      });
    this.authenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.authenticated = isAuthenticated;
        this.id = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
  }

  onDelete(id: string): void {
    this.isLoading = true;
    this.mangasService.deleteManga(id).subscribe(() => {
      // to update data since we update datas when we get mangas
      this.mangasService.getMangas(this.currentPage, this.pageSize);
    });
  }

  onBookmark(id: string): void {
    this.mangasService.bookmarkManga(id);
  }
}
