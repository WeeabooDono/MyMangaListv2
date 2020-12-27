import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MangasComponent } from './mangas/mangas.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserShowComponent } from './users/user-show/user-show.component';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';
import { MangaShowComponent } from './mangas/manga-show/manga-show.component';
import { MangaCreateComponent } from './mangas/manga-create/manga-create.component';
import { MangaEditComponent } from './mangas/manga-edit/manga-edit.component';

// Auth components
@NgModule({
  declarations: [
    AdminComponent,
    MangasComponent,
    UserListComponent,
    UserEditComponent,
    UserShowComponent,
    MangaListComponent,
    MangaShowComponent,
    MangaCreateComponent,
    MangaEditComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
