import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard} from './auth/admin.guard'
import { MangaCreateComponent } from './mangas/manga-create/manga-create.component';
import { MangaEditComponent } from './mangas/manga-edit/manga-edit.component';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';

const routes: Routes = [
  { path: '', component: MangaListComponent },
  { path: 'mangas/create', component: MangaCreateComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'mangas/edit/:id', component: MangaEditComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule { }
