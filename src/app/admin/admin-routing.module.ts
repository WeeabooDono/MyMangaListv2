import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangaListComponent } from './mangas/manga-list/manga-list.component';

// Admin components
import { AdminComponent } from './admin.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserShowComponent } from './users/user-show/user-show.component';
import { MangaEditComponent } from './mangas/manga-edit/manga-edit.component';
import { MangaShowComponent } from './mangas/manga-show/manga-show.component';
import { MangaCreateComponent } from './mangas/manga-create/manga-create.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { TeamCreateComponent } from './teams/team-create/team-create.component';
import { TeamEditComponent } from './teams/team-edit/team-edit.component';
import { TeamShowComponent } from './teams/team-show/team-show.component';

const routes: Routes = [
    { path: 'dashboard', component: AdminComponent },
    { path: 'users', component: UserListComponent },
    { path: 'users/edit/:id', component: UserEditComponent },
    { path: 'users/show/:id', component: UserShowComponent },
    { path: 'mangas', component: MangaListComponent },
    { path: 'mangas/create', component: MangaCreateComponent },
    { path: 'mangas/edit/:id', component: MangaEditComponent },
    { path: 'mangas/show/:id', component: MangaShowComponent },
    { path: 'teams', component: TeamListComponent },
    { path: 'teams/create', component: TeamCreateComponent },
    { path: 'teams/edit/:id', component: TeamEditComponent },
    { path: 'teams/show/:id', component: TeamShowComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
