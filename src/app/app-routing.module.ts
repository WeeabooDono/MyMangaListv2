import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MangaCreateComponent } from './mangas/manga-create/manga-create.component';
import { MangaEditComponent } from './mangas/manga-edit/manga-edit.component';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';

const routes: Routes = [
  { path: 'mangas', component: MangaListComponent },
  { path: 'mangas/create', component: MangaCreateComponent },
  { path: 'mangas/edit/:id', component: MangaEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
