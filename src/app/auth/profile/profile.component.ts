import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/admin/users/user.model';
import { UsersService } from 'src/app/admin/users/users.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  isLoading = false;

  private username!: string;

  public isPublic = false;
  public isLoggedUser = false;
  public authUser!: User;
  public user!: User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    public usersService: UsersService,
    private router: Router,
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
          // if the profile exists
          if (this.user) {
            // if the profile is public or not
            this.isPublic = this.user.status === 'public';

            // if it is not the authenticated User and the profile is private, redirect to 403
            if (this.authUser) {
              // if it is the profile of the logged user
              this.isLoggedUser = this.user.id === this.authUser.id;

              // if it is not the logged user and it is private
              if (!this.isLoggedUser && !this.isPublic) {
                this.router.navigate(['/403']);
              }
            } else {
              // if you're not logged in and the profile is private
              if (!this.isPublic) {
                this.router.navigate(['/403']);
              }
            }
          } else this.router.navigate(['/404']);
        });
    });
  }

  ngOnDestroy(): void {}
}
