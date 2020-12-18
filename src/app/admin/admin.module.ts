import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MangasComponent } from './mangas/mangas.component';
import { UserListComponent } from './users/user-list/user-list.component';

// Auth components
@NgModule({
  declarations: [AdminComponent, MangasComponent, UserListComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
