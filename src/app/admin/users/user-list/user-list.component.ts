import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
    authUser!: User;
    private authListenerSub: Subscription = new Subscription();

    users: User[] = [];
    private usersSub: Subscription = new Subscription();

    isLoading = false;
    displayedColumns: string[] = [
        'index',
        'username',
        'email',
        'status',
        'roles',
        'actions',
    ];

    constructor(
        private authService: AuthService,
        public usersService: UsersService,
    ) {}

    ngOnInit(): void {
        this.authUser = this.authService.getAuthUser();
        this.users = this.usersService.getUsers();

        this.authListenerSub = this.authService
            .getAuthStatusListener()
            .subscribe(() => {
                this.authUser = this.authService.getAuthUser();
                this.isLoading = false;
            });

        this.usersSub = this.usersService
            .getUserUpdateListener()
            .subscribe((usersData) => {
                this.users = usersData.users;
                this.isLoading = false;
            });
    }

    onDelete(id: number): void {
        this.isLoading = true;
        this.usersService.deleteUser(id).subscribe((userData) => {
            this.users = this.usersService.getUsers();
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.usersSub.unsubscribe();
        this.authListenerSub.unsubscribe();
    }
}
