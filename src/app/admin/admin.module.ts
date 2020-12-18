import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { MangasComponent } from './mangas/mangas.component'

// Auth components
@NgModule({
    declarations: [
        AdminComponent,
        UsersComponent,
        MangasComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        AdminRoutingModule,
    ]
})
export class AdminModule{}