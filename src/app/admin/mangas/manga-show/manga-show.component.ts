import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Manga } from '../manga.model';
import { MangasService } from '../mangas.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BookmarksService } from 'src/app/bookmarks/bookmarks.service';
import { Bookmark } from 'src/app/bookmarks/bookmark.model';
import { Subscription } from 'rxjs';
import { User } from '../../users/user.model';
import { ConfirmationDialog } from '../confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manga-show',
  templateUrl: './manga-show.component.html',
  styleUrls: ['./manga-show.component.css'],
})
export class MangaShowComponent implements OnInit {
  isLoading = false;

  manga!: Manga;

  private id!: number;
  stars: string[] = [];
  vote_msg = '';
  readers_msg = '';

  authenticated = false;
  authUser!: User;
  bookmarked = false;

  bookmark!: Bookmark;

  constructor(
    public mangasService: MangasService,
    public bookmarkService: BookmarksService,
    private authService: AuthService,
    private dialog: MatDialog,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authService.getIsAuth();
    this.authUser = this.authService.getAuthUser();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      this.id = (paramMap.get('id') as unknown) as number;

      // manga service
      this.mangasService
        .getManga(this.id)
        .subscribe((mangaData: { manga: Manga; message: string }) => {
          this.manga = mangaData.manga;
          this.isLoading = false;

          if (this.manga.readers! > 1) {
            this.readers_msg = 'readers are reading this !';
          } else this.readers_msg = 'reader is reading this.';

          this.generateStars();
        });

      // bookmark service
      this.bookmarkService
        .getBookmark(this.authUser.id, this.id)
        .subscribe((bookmarkData: { bookmark: Bookmark }) => {
          if (bookmarkData.bookmark) {
            this.bookmark = bookmarkData.bookmark;
            this.bookmarked = true;
          } else this.bookmarked = false;
        });
    });
  }

  generateStars(): void {
    const roundedScore = Math.round(this.manga.score!);
    if (this.manga.votes! > 1) this.vote_msg = 'votes';
    else this.vote_msg = 'vote';

    // we reset the array anyway
    this.stars = [];

    for (let score = 0; score < 10; score += 2) {
      const rest = roundedScore - score;
      if (rest >= 2) this.stars.push('star');
      else if (rest > 0 && rest <= 2) this.stars.push('star_half');
      else this.stars.push('star_outline');
    }
  }

  onBookmark(): void {
    this.isLoading = true;
    this.mangasService.bookmarkManga(this.id).subscribe(
      () => {
        this.mangasService
          .getManga(this.id)
          .subscribe((mangaData: { manga: Manga; message: string }) => {
            this.manga = mangaData.manga;
            this.isLoading = false;
            this.generateStars();
          });
        this.bookmarkService
          .getBookmark(this.authUser.id, this.id)
          .subscribe((bookmarkData: { bookmark: Bookmark }) => {
            this.bookmark = bookmarkData.bookmark;
            this.isLoading = false;
          });
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  onUnbookmark(): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure you want to unbookmark this manga ?',
        buttonText: {
          ok: 'Unbookmark',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.mangasService.unbookmarkManga(this.id).subscribe(
          () => {
            this.mangasService
              .getManga(this.id)
              .subscribe((mangaData: { manga: Manga; message: string }) => {
                this.manga = mangaData.manga;
                this.isLoading = false;
                this.generateStars();
              });
            this.bookmarkService
              .getBookmark(this.authUser.id, this.id)
              .subscribe((bookmarkData: { bookmark: Bookmark }) => {
                this.bookmark = bookmarkData.bookmark;
              });
          },
          () => {
            this.isLoading = false;
          },
        );
      }
    });
  }
}
