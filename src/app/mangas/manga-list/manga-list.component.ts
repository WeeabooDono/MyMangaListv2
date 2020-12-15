import { Component, OnDestroy, OnInit} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Bookmark } from 'src/app/bookmarks/bookmark.model';
import { BookmarksService } from 'src/app/bookmarks/bookmarks.service';

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

  bookmarks: Bookmark[] = [];
  private bookmarksSub: Subscription = new Subscription;

  isLoading = false;

  // pagination attributes
  length = 0;
  pageSize = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  constructor(public mangasService: MangasService, public bookmarkService: BookmarksService, private authService: AuthService) { }

  ngOnDestroy(): void {
    this.mangasSub.unsubscribe();
    this.bookmarksSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    // initialisations
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
    this.id = this.authService.getUserId();

    // subscribe to manga service
    this.mangasSub = this.mangasService.getMangasUpdateListener()
      .subscribe((mangaData: { mangas: Manga[], mangaCount: number }) => {
        this.isLoading = false;
        this.mangas = mangaData.mangas;
        this.length = mangaData.mangaCount;
        console.log(this.length)
    });
      

    this.authenticated = this.authService.getIsAuth();
    // subscribe to auth service
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoading = false;
        this.authenticated = isAuthenticated;
        this.id = this.authService.getUserId();
      });

    // subscribe to bookmarks service
    if(this.authenticated){
      this.bookmarks = this.bookmarkService.getbookmarksfromloggedUser();
      this.bookmarksSub = this.bookmarkService.getBookmarkUpdateListener()
        .subscribe((bookmarkData : { bookmarks: Bookmark[] }) => {
          this.isLoading = false;
          this.bookmarks = bookmarkData.bookmarks;
      })
    }
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
  }

  onDelete(id: Number): void {
    this.isLoading = true;
    this.mangasService.deleteManga(id).subscribe(() => {
      // to update data since we update datas when we get mangas
      this.mangasService.getMangas(this.currentPage, this.pageSize);
    }, () => {
      this.isLoading = false;
    });
  }

  onBookmark(id: Number): void {
    this.mangasService.bookmarkManga(id).subscribe(() => {
      this.mangasService.getMangas(this.currentPage, this.pageSize);
      if(this.authenticated){
        this.bookmarks = this.bookmarkService.getbookmarksfromloggedUser();
      }
    }, () => {
      this.isLoading = false;
    });
  }

  onUnbookmark(id: Number): void {
    this.mangasService.unbookmarkManga(id).subscribe(() => {
      this.mangasService.getMangas(this.currentPage, this.pageSize);
      if(this.authenticated){
        this.bookmarks = this.bookmarkService.getbookmarksfromloggedUser();
      }
    }, () => {
      this.isLoading = false;
    });
  }

  isBookmarked(manga: Manga){
    let bookmarked = false;
    this.bookmarks.forEach(bookmark => {
      if(bookmark.manga_id === manga.id) bookmarked = true;
    })
    return bookmarked;
  }
}
