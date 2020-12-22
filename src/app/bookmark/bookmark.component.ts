import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bookmark } from 'src/app/bookmark/bookmark.model';
import { BookmarksService } from 'src/app/bookmark/bookmarks.service';
import { User } from '../admin/users/user.model';
import { UsersService } from '../admin/users/users.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit, OnDestroy {
  isLoading = false;

  bookmarks: Bookmark[] = [];
  private bookmarksSub: Subscription = new Subscription();

  private username!: string;
  public user!: User;
  public isPublic = false;

  public authUser!: User;

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
    private route: ActivatedRoute,
    private authService: AuthService,
    public bookmarkService: BookmarksService,
    public usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authUser = this.authService.getAuthUser();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.get('username') == null) return;
      this.username = paramMap.get('username')!;
      this.isLoading = true;
      this.usersService
        .getUserByUsername(this.username)
        .subscribe((userData) => {
          this.user = userData.user;
          this.user.status === 'public'
            ? (this.isPublic = true)
            : (this.isPublic = false);
          console.log('user:' + this.user.username);
          console.log('authUser:' + this.authUser.username);
          // if it is not the authenticated User and the profile is private, redirect to 403
          if (this.user.id !== this.authUser.id && !this.isPublic) {
            this.router.navigate(['/403']);
          }

          // get the bookmarks
          this.bookmarks = this.bookmarkService.getBookmarks(this.user.id);
          this.bookmarksSub = this.bookmarkService
            .getBookmarkUpdateListener()
            .subscribe((bookmarkData: { bookmarks: Bookmark[] }) => {
              this.isLoading = false;
              this.bookmarks = bookmarkData.bookmarks;
            });
        });
    });
  }

  ngOnDestroy(): void {
    this.bookmarksSub.unsubscribe();
  }
}
