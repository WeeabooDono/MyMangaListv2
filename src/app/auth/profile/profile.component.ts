import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/admin/users/user.model';
import { UsersService } from 'src/app/admin/users/users.service';
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

  private username!: string;
  public user!: User;
  public isPublic = false;

  public authUser!: User;

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.username = paramMap.get('username')!;
      this.isLoading = true;
      this.usersService
        .getUserByUsername(this.username)
        .subscribe((userData) => {
          this.user = userData.user;
          if (!this.user) this.router.navigate(['/404']);
          else {
            this.user.status === 'public'
              ? (this.isPublic = true)
              : (this.isPublic = false);

            // if it is not the authenticated User and the profile is private, redirect to 403
            if (this.authUser) {
              if (this.user.id !== this.authUser.id && !this.isPublic) {
                this.router.navigate(['/403']);
              }
            } else {
              if (!this.isPublic) {
                this.router.navigate(['/403']);
              }
            }
          }
        });
    });
  }

  ngOnDestroy(): void {}
}
