import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { ConfirmationDialog } from '../admin/mangas/confirmation-dialog.component';

// Manga components
import { MangaListComponent } from './manga-list/manga-list.component';

@NgModule({
  declarations: [MangaListComponent, ConfirmationDialog],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
})
export class MangaModule {}
