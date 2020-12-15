import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Bookmark } from 'src/app/bookmarks/bookmark.model';
import { BookmarksService } from 'src/app/bookmarks/bookmarks.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub!: Subscription;

  bookmarks: Bookmark[] = [];
  private bookmarksSub: Subscription = new Subscription;

  displayedColumns: string[] = ['Image', 'Manga Title', 'Score', 'Chapters', 'Volumes', 'Type', 'Actions'];

  constructor(public authService: AuthService, public bookmarkService: BookmarksService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    this.bookmarks = this.bookmarkService.getbookmarksfromloggedUser();
      this.bookmarksSub = this.bookmarkService.getBookmarkUpdateListener()
        .subscribe((bookmarkData : { bookmarks: Bookmark[] }) => {
          this.isLoading = false;
          this.bookmarks = bookmarkData.bookmarks;
          console.log(this.bookmarks)
      })
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.bookmarksSub.unsubscribe();
  }

}
