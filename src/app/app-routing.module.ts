import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MangaCreateComponent } from './mangas/manga-create/manga-create.component';
import { MangaEditComponent } from './mangas/manga-edit/manga-edit.component';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';

const routes: Routes = [
  { path: '', component: MangaListComponent },
  { path: 'mangas/create', component: MangaCreateComponent, canActivate: [AuthGuard] },
  { path: 'mangas/edit/:id', component: MangaEditComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
