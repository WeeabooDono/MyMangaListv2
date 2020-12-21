import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Bookmark } from 'src/app/bookmark/bookmark.model';
import { BookmarksService } from 'src/app/bookmark/bookmarks.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub!: Subscription;

  bookmarks: Bookmark[] = [];
  private bookmarksSub: Subscription = new Subscription();

  displayedColumns: string[] = [
    'Image',
    'Manga Title',
    'Score',
    'Chapters',
    'Volumes',
    'Type',
    'Actions'
  ];

  constructor(
    public authService: AuthService,
    public bookmarkService: BookmarksService
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.bookmarks = this.bookmarkService.getbookmarksfromloggedUser();
    this.bookmarksSub = this.bookmarkService
      .getBookmarkUpdateListener()
      .subscribe((bookmarkData: { bookmarks: Bookmark[] }) => {
        this.isLoading = false;
        this.bookmarks = bookmarkData.bookmarks;
        console.log(this.bookmarks);
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.bookmarksSub.unsubscribe();
  }
}
