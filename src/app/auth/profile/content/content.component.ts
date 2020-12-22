import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/admin/users/user.model';

@Component({
  selector: 'profile-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Input() authUser!: User;
  @Input() user!: User;

  constructor() {}

  ngOnInit(): void {
    console.log(this.user);
  }
}
