import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin components
import { AdminComponent } from './admin.component';
import { MangasComponent } from './mangas/mangas.component';
import { UserListComponent } from './users/user-list/user-list.component';
const routes: Routes = [
  { path: 'dashboard', component: AdminComponent },
  { path: 'users', component: UserListComponent },
  { path: 'mangas', component: MangasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
