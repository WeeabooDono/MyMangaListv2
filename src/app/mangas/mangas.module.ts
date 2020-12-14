import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';

// Manga components
import { MangaCreateComponent } from './manga-create/manga-create.component';
import { MangaEditComponent } from './manga-edit/manga-edit.component';
import { MangaListComponent } from './manga-list/manga-list.component';

@NgModule({
    declarations: [
        MangaListComponent,
        MangaCreateComponent,
        MangaEditComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        AngularMaterialModule
    ]
})
export class MangaModule{}