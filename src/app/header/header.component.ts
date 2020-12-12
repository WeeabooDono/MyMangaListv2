import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authenticated = false;
  private authListenerSub!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.authenticated = isAuthenticated;
      });
  }

  ngOnDestroy(){
    this.authListenerSub.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}
