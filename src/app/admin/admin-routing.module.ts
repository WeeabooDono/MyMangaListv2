import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin components
import { AdminComponent } from './admin.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
