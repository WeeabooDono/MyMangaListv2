import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/admin/users/user.model';
import { Bookmark } from 'src/app/bookmark/bookmark.model';
import { BookmarksService } from 'src/app/bookmark/bookmarks.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading = false;
  authUser!: User;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authUser = this.authService.getAuthUser();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
        this.authUser = this.authService.getAuthUser();
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
