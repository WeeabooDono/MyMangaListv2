import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserShowComponent } from './users/user-show/user-show.component';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';
import { MangaShowComponent } from './mangas/manga-show/manga-show.component';
import { MangaCreateComponent } from './mangas/manga-create/manga-create.component';
import { MangaEditComponent } from './mangas/manga-edit/manga-edit.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { TeamShowComponent } from './teams/team-show/team-show.component';
import { TeamCreateComponent } from './teams/team-create/team-create.component';

// Auth components
@NgModule({
    declarations: [
        AdminComponent,
        UserListComponent,
        UserEditComponent,
        UserShowComponent,
        MangaListComponent,
        MangaShowComponent,
        MangaCreateComponent,
        MangaEditComponent,
        TeamListComponent,
        TeamEditComponent,
        TeamShowComponent,
        TeamCreateComponent,
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
