import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './admin/admin.guard';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';
import { NotFoundComponent } from './404/notfound.component';
import { ForbiddenComponent } from './403/forbidden.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';

const routes: Routes = [
  { path: '', component: MangaListComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((module) => module.AdminModule),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => module.AuthModule),
  },
  { path: 'bookmark/:username', component: BookmarksComponent },
  { path: '404', component: NotFoundComponent },
  { path: '403', component: ForbiddenComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard],
})
export class AppRoutingModule {}
