import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm){
    if(!form.valid) return;
    const authData: AuthData = {
            email: form.value.email,
            username: form.value.username,
            password: form.value.password,
            password2:  form.value.password
        }
    this.authService.createUser(authData);
  }
}
