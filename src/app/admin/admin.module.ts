import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module'

// Auth components
@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        AdminRoutingModule,
    ]
})
export class AdminModule{}