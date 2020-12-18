import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAdmin = false;

  authenticated = false;
  private authListenerSub!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();

    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.authenticated = isAuthenticated;
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
