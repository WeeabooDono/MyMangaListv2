import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialog } from 'src/app/admin/mangas/confirmation-dialog.component';
import { Manga } from 'src/app/mangas/manga.model';
import { MangasService } from 'src/app/mangas/mangas.service';

@Component({
  selector: 'app-manga-list',
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.css'],
})
export class MangaListComponent implements OnInit, OnDestroy {
  mangaCount!: number;
  mangas: Manga[] = [];
  private mangasSub: Subscription = new Subscription();

  isLoading = false;

  displayedColumns: string[] = [
    'index',
    'Image',
    'Manga Title',
    'Author',
    'Type',
    'Actions',
  ];

  constructor(public mangasService: MangasService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.mangas = this.mangasService.getMangasList();

    this.mangasSub = this.mangasService
      .getMangasUpdateListener()
      .subscribe((mangaData: { mangas: Manga[]; mangaCount: number }) => {
        this.mangas = mangaData.mangas;
        this.mangaCount = mangaData.mangaCount;
      });
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: 'Are you sure you want to delete this manga ?',
        buttonText: {
          ok: 'Delete',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.mangasService.deleteManga(id).subscribe(
          () => {
            // to update data since we update datas when we get mangas
            this.mangasService.getMangasList();
          },
          () => {
            this.isLoading = false;
          },
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.mangasSub.unsubscribe();
  }
}
