import { Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { User } from 'src/app/admin/users/user.model';
import { ProfileComponent } from '../profile.component';
@Component({
  selector: 'profile-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  private authUser!: User;
  public user!: User;
  public isLoggedUser!: boolean;

  private MIME_TYPE_MAP = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor(
    @Inject(forwardRef(() => ProfileComponent))
    private _parent: ProfileComponent,
  ) {}

  ngOnInit(): void {
    this.user = this._parent.user;
    this.isLoggedUser = this._parent.isLoggedUser;
    this.authUser = this._parent.authUser;

    // console.log(this.authUser);
    // console.log(this.user);
    // console.log(this.isLoggedUser);
  }

  onImagePicked(event: Event): void {
    // catch image
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const image = (event.target as HTMLInputElement).files![0];
    const isValid = this.MIME_TYPE_MAP.includes(image.type);
    this.authUser.image = image;
    if (isValid) {
      this._parent.usersService
        .uploadProfileImage(this.authUser)
        .subscribe((response) => (this.user = response.user));
    }
  }
}
