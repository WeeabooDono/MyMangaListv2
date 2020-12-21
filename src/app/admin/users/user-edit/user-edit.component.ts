import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public isLoading = false;
  private id!: number;

  public user!: User;

  constructor(
    public usersService: UsersService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = (paramMap.get('id') as unknown) as number;
      this.isLoading = true;
      this.usersService.getUser(this.id).subscribe((userData) => {
        this.user = userData.user;
      });
    });
  }
}
