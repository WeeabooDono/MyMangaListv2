import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { User } from 'src/app/admin/users/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Bookmark } from 'src/app/bookmarks/bookmark.model';
import { BookmarksService } from 'src/app/bookmarks/bookmarks.service';
import { ConfirmationDialog } from '../../admin/mangas/confirmation-dialog.component';

import { Manga } from '../../admin/mangas/manga.model';
import { MangasService } from '../../admin/mangas/mangas.service';

@Component({
  selector: 'app-manga-list',
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.css'],
})
export class MangaListComponent implements OnInit, OnDestroy {
  authenticated = false;
  isAdmin = false;
  authUser!: User;
  private authListenerSub!: Subscription;

  mangas: Manga[] = [];
  private mangasSub: Subscription = new Subscription();

  bookmarks: Bookmark[] = [];
  private bookmarksSub: Subscription = new Subscription();

  isLoading = false;

  // pagination attributes
  length = 0;
  pageSize = 12;
  pageSizeOptions = [4, 8, 12, 16];
  currentPage = 1;

  constructor(
    public mangasService: MangasService,
    public bookmarkService: BookmarksService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnDestroy(): void {
    this.mangasSub.unsubscribe();
    this.bookmarksSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    // initialisations
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
    this.authUser = this.authService.getAuthUser();

    // subscribe to manga service
    this.mangasSub = this.mangasService
      .getMangasUpdateListener()
      .subscribe((mangaData: { mangas: Manga[]; mangaCount: number }) => {
        this.isLoading = false;
        this.mangas = mangaData.mangas;
        this.length = mangaData.mangaCount;
      });

    this.authenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();
    // subscribe to auth service
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isLoading = false;
        this.authenticated = isAuthenticated;
        this.authUser = this.authService.getAuthUser();
        this.isAdmin = this.authService.getIsAdmin();
      });

    // subscribe to bookmarks service
    if (this.authenticated) {
      this.bookmarks = this.bookmarkService.getBookmarks(this.authUser.id);
      this.bookmarksSub = this.bookmarkService
        .getBookmarkUpdateListener()
        .subscribe((bookmarkData: { bookmarks: Bookmark[] }) => {
          this.isLoading = false;
          this.bookmarks = bookmarkData.bookmarks;
        });
    }
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.mangas = this.mangasService.getMangas(this.currentPage, this.pageSize);
  }

  onBookmark(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure you want to bookmark this manga ?',
        buttonText: {
          ok: 'Bookmark',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.mangasService.bookmarkManga(id).subscribe(
          () => {
            this.mangasService.getMangas(this.currentPage, this.pageSize);
            if (this.authenticated) {
              this.bookmarks = this.bookmarkService.getBookmarks(
                this.authUser.id,
              );
            }
          },
          () => {
            this.isLoading = false;
          },
        );
      }
    });
  }

  onUnbookmark(id: number): void {
    this.mangasService.unbookmarkManga(id).subscribe(
      () => {
        this.mangasService.getMangas(this.currentPage, this.pageSize);
        if (this.authenticated) {
          this.bookmarks = this.bookmarkService.getBookmarks(this.authUser.id);
        }
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  getStars(score: number): string[] {
    const roundedScore = Math.round(score);

    // we reset the array anyway
    const stars = [];

    for (let score = 0; score < 10; score += 2) {
      const rest = roundedScore - score;
      if (rest >= 2) stars.push('star');
      else if (rest > 0 && rest <= 2) stars.push('star_half');
      else stars.push('star_outline');
    }

    return stars;
  }

  isBookmarked(manga: Manga): boolean {
    let bookmarked = false;
    this.bookmarks.forEach((bookmark) => {
      if (bookmark.manga_id === manga.id) bookmarked = true;
    });
    return bookmarked;
  }

  readMoreReadLess(manga_id: number): void {
    const dots = document.getElementById('dots' + manga_id);
    const more = document.getElementById('more' + manga_id);
    const button = document.getElementById('button' + manga_id);
    const a = document.getElementById('a' + manga_id);
    if (dots!.style.display === 'none') {
      dots!.style.display = 'inline';
      button!.innerHTML = 'more';
      more!.style.display = 'none';
    } else {
      dots!.style.display = 'none';
      button!.innerHTML = 'less';
      more!.style.display = 'inline';
    }
  }
}
