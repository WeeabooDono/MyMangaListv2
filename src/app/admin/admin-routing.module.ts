import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin components
import { AdminComponent } from './admin.component';
import { MangasComponent } from './mangas/mangas.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserShowComponent } from './users/user-show/user-show.component';
const routes: Routes = [
  { path: 'dashboard', component: AdminComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/edit/:id', component: UserEditComponent },
  { path: 'users/show/:id', component: UserShowComponent },
  { path: 'mangas', component: MangasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
