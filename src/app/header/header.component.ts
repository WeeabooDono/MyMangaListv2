import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../admin/users/user.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAdmin = false;
  user!: User;

  authenticated = false;
  private authListenerSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();
    this.user = this.authService.getAuthUser();

    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.authenticated = isAuthenticated;
        this.user = this.authService.getAuthUser();
        this.isAdmin = this.authService.getIsAdmin();
      });
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
